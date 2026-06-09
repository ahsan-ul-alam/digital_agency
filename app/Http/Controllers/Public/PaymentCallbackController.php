<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\PaymentTransaction;
use App\Services\BkashPaymentService;
use App\Services\EpsPaymentService;
use App\Services\OnlinePaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PaymentCallbackController extends Controller
{
    public function bkash(
        Request $request,
        PaymentTransaction $transaction,
        BkashPaymentService $bkash,
        OnlinePaymentService $payments
    ): RedirectResponse {
        abort_unless($transaction->gateway === 'bkash', 404);

        $paymentId = $request->query('paymentID', $transaction->gateway_transaction_id);
        $status = strtolower((string) $request->query('status', ''));

        if (! $paymentId) {
            $payments->fail($transaction, 'Missing bKash payment reference.');

            return $this->redirectToInvoice($transaction, 'error', 'Payment could not be verified.');
        }

        if (in_array($status, ['cancel', 'cancelled'], true)) {
            $payments->cancel($transaction, ['callback' => $request->query()]);

            return $this->redirectToInvoice($transaction, 'error', 'Payment was cancelled.');
        }

        try {
            $result = $bkash->execute($paymentId);
            $transactionStatus = strtolower((string) ($result['transactionStatus'] ?? $result['statusMessage'] ?? ''));

            if (in_array($transactionStatus, ['completed', 'success'], true)) {
                $payments->complete($transaction, ['execute_response' => $result]);

                return $this->redirectToInvoice($transaction, 'success', 'Payment received. Thank you!');
            }

            $query = $bkash->query($paymentId);
            $queryStatus = strtolower((string) ($query['transactionStatus'] ?? ''));

            if (in_array($queryStatus, ['completed', 'success'], true)) {
                $payments->complete($transaction, ['query_response' => $query]);

                return $this->redirectToInvoice($transaction, 'success', 'Payment received. Thank you!');
            }

            $payments->fail($transaction, $result['statusMessage'] ?? 'Payment was not completed.', [
                'execute_response' => $result,
                'query_response' => $query,
            ]);

            return $this->redirectToInvoice($transaction, 'error', 'Payment was not completed.');
        } catch (\Throwable $exception) {
            $payments->fail($transaction, $exception->getMessage());

            return $this->redirectToInvoice($transaction, 'error', 'Payment verification failed.');
        }
    }

    public function epsSuccess(
        PaymentTransaction $transaction,
        EpsPaymentService $eps,
        OnlinePaymentService $payments
    ): RedirectResponse {
        abort_unless($transaction->gateway === 'eps', 404);

        try {
            $result = $eps->verify($transaction->merchant_transaction_id);

            if ($eps->isSuccessful($result)) {
                $payments->complete($transaction, ['verify_response' => $result]);

                return $this->redirectToInvoice($transaction, 'success', 'Payment received. Thank you!');
            }

            $payments->fail($transaction, $result['Status'] ?? 'EPS payment failed.', ['verify_response' => $result]);

            return $this->redirectToInvoice($transaction, 'error', 'Payment was not completed.');
        } catch (\Throwable $exception) {
            $payments->fail($transaction, $exception->getMessage());

            return $this->redirectToInvoice($transaction, 'error', 'Payment verification failed.');
        }
    }

    public function epsFail(
        Request $request,
        PaymentTransaction $transaction,
        OnlinePaymentService $payments
    ): RedirectResponse {
        abort_unless($transaction->gateway === 'eps', 404);

        $payments->fail($transaction, 'EPS reported payment failure.', ['callback' => $request->query()]);

        return $this->redirectToInvoice($transaction, 'error', 'Payment failed.');
    }

    public function epsCancel(
        Request $request,
        PaymentTransaction $transaction,
        OnlinePaymentService $payments
    ): RedirectResponse {
        abort_unless($transaction->gateway === 'eps', 404);

        $payments->cancel($transaction, ['callback' => $request->query()]);

        return $this->redirectToInvoice($transaction, 'error', 'Payment was cancelled.');
    }

    public function epsIpn(
        Request $request,
        EpsPaymentService $eps,
        OnlinePaymentService $payments
    ): JsonResponse {
        $encrypted = (string) ($request->input('Data') ?? '');
        $payload = $eps->decryptIpn($encrypted);

        if (! $payload) {
            return response()->json(['status' => 'invalid'], 400);
        }

        $merchantTransactionId = (string) ($payload['merchant_transaction_id'] ?? '');
        $transaction = $payments->findByMerchantTransactionId($merchantTransactionId);

        if (! $transaction) {
            return response()->json(['status' => 'ignored']);
        }

        $status = strtolower((string) ($payload['status'] ?? ''));

        if (in_array($status, ['success', 'completed'], true)) {
            $payments->complete($transaction, ['ipn_payload' => $payload]);
        } elseif (in_array($status, ['failed', 'failure'], true)) {
            $payments->fail($transaction, 'EPS IPN failure.', ['ipn_payload' => $payload]);
        } elseif (in_array($status, ['cancelled', 'canceled'], true)) {
            $payments->cancel($transaction, ['ipn_payload' => $payload]);
        }

        return response()->json(['status' => 'ok']);
    }

    private function redirectToInvoice(PaymentTransaction $transaction, string $flashKey, string $message): RedirectResponse
    {
        return redirect()
            ->route('portal.invoices.show', $transaction->invoice_id)
            ->with($flashKey, $message);
    }
}
