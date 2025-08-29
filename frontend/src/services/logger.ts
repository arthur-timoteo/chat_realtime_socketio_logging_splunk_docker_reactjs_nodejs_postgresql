import { api } from './axios';

export const Log = async (message: string, type_log: string, path_log: string, data: string | null) => {
    try {
        const response = await api.post('/log', {
            event: {
                message,
                type_log,
                path_log,
                data,
                project: 'frontend'
            }
        });

        console.log(response.data);
    } catch (error) {
        console.error('Error sending log to Splunk:', error);
    }
};
