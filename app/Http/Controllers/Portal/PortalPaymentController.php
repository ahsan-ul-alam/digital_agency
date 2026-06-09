<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Services\BkashPaymentService;
use App\Services\ClientPortalService;
use App\Services\EpsPaymentService;
use App\Services\OnlinePaymentService;
use App\Support\PaymentHelpers;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class PortalPaymentController extends Controller
{
    public function payBkash(
        Request $request,
        Invoice $invoice,
        ClientPortalService $portal,
        BkashPaymentService $bkash,
        OnlinePaymentService $payments
    ): RedirectResponse|SymfonyResponse {
        $user = $request->user()->load('lead');
        abort_unless($portal->ownsInvoice($user, $invoice), 404);

        if (! $bkash->isReady()) {
            return back()->with('error', 'bKash payments are not configured yet.');
        }

        $balanceDue = $invoice->balanceDue();
        if ($balanceDue <= 0) {
            return back()->with('error', 'This invoice has no outstanding balance.');
        }

        try {
            $transaction = $payments->createTransaction($invoice, $user, 'bkash', $balanceDue);
            $callbackUrl = route('payments.bkash.callback', ['transaction' => $transaction->id]);

            $checkout = $bkash->createCheckout(
                $transaction,
                PaymentHelpers::bkashPayerReference($user),
                $callbackUrl
            );

            $payments->markGatewayReference($transaction, $checkout['paymentID'], [
                'create_response' => $checkout,
            ]);

            return $this->redirectExternal($checkout['bkashURL']);
        } catch (\Throwable $exception) {
            return back()->with('error', $exception->getMessage());
        }
    }

    public function payEps(
        Request $request,
        Invoice $invoice,
        ClientPortalService $portal,
        EpsPaymentService $eps,
        OnlinePaymentService $payments
    ): RedirectResponse|SymfonyResponse {
        $user = $request->user()->load('lead');
        abort_unless($portal->ownsInvoice($user, $invoice), 404);

        if (! $eps->isReady()) {
            return back()->with('error', 'EPS payments are not configured yet.');
        }

        $balanceDue = $invoice->balanceDue();
        if ($balanceDue <= 0) {
            return back()->with('error', 'This invoice has no outstanding balance.');
        }

        try {
            $transaction = $payments->createTransaction($invoice, $user, 'eps', $balanceDue);
            $urls = [
                'success' => route('payments.eps.success', ['transaction' => $transaction->id]),
                'fail' => route('payments.eps.fail', ['transaction' => $transaction->id]),
                'cancel' => route('payments.eps.cancel', ['transaction' => $transaction->id]),
            ];

            $checkout = $eps->initialize($invoice, $transaction, $user, $urls);

            $payments->markGatewayReference($transaction, $checkout['TransactionId'] ?? null, [
                'init_response' => $checkout,
            ]);

            return $this->redirectExternal($checkout['RedirectURL']);
        } catch (\Throwable $exception) {
            return back()->with('error', $exception->getMessage());
        }
    }

    private function redirectExternal(string $url): SymfonyResponse
    {
        return Inertia::location($url);
    }
}
