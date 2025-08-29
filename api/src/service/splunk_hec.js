const axios = require('axios');

const splunkHEC = axios.create({
  baseURL: 'http://crslsdrnp-cntnr-splunk:8088/services/collector/event',
  headers: {
    'Authorization': 'Splunk a13445cf-1530-41d3-b4c7-37a3a0209799',
    'Content-Type': 'application/json',
  }
});

const sendToSplunk = async (message, type_log, path_log, data, project, request) => {
  try {
    const response = await splunkHEC.post('', {
        event: {
            message,
            type_log,
            path_log,
            data,
            project: project,
            request: {
              header_user_agent: request?.headers['user-agent'] || null,
              header_sec_ch_ua_platform: request?.headers['sec-ch-ua-platform'] || null,
              header_sec_ch_ua: request?.headers['sec-ch-ua'] || null,
              header_sec_ch_ua_mobile: request?.headers['sec-ch-ua_mobile'] || null,
              header_origin: request?.headers['origin'] || null,
              header_sec_fetch_site: request?.headers['sec-fetch-site'] || null,
              socker_remote_address: request?.socket.remoteAddress || null,
            }
        }
    });
  } catch (error) {
    console.error('Error sending data to Splunk:', error);
  }
}

module.exports = sendToSplunk;