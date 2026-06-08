import axios from 'axios';

export async function uploadEditorImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/admin/editor/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
}
