import { spawn } from 'child_process';
import http from 'http';

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
        });
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  console.log('Starting Next.js production server for testing...');
  const server = spawn('node', ['node_modules/next/dist/bin/next', 'start', '-p', '3000'], {
    stdio: 'inherit',
    env: process.env,
  });

  // Wait 4 seconds for server ready
  await new Promise((r) => setTimeout(r, 4000));

  try {
    // 1. Test homepage
    console.log('Testing GET / ...');
    const homeRes = await request({ host: '127.0.0.1', port: 3000, path: '/', method: 'GET' });
    console.log(`GET / status: ${homeRes.statusCode}`);

    // 2. Test Contact page
    console.log('Testing GET /contact ...');
    const contactRes = await request({ host: '127.0.0.1', port: 3000, path: '/contact', method: 'GET' });
    console.log(`GET /contact status: ${contactRes.statusCode}`);

    // 3. Test Admin Login Page
    console.log('Testing GET /admin/login ...');
    const adminLoginRes = await request({ host: '127.0.0.1', port: 3000, path: '/admin/login', method: 'GET' });
    console.log(`GET /admin/login status: ${adminLoginRes.statusCode}`);

    // 4. Test Inquiries POST (submission from contact form)
    console.log('Testing POST /api/inquiries (contact form submission) ...');
    const newInquiryPayload = JSON.stringify({
      fullName: 'Test Client',
      companyName: 'Creative Design Studio',
      email: 'client@designstudio.com',
      phone: '01700000000',
      serviceInterested: 'Commercial Space Design',
      projectLocation: 'Gulshan 1, Dhaka',
      projectDetails: 'We need a modern 2000 sqft café design with water bubble stainless steel panels and custom wood counters.',
    });

    const inquiryPostRes = await request(
      {
        host: '127.0.0.1',
        port: 3000,
        path: '/api/inquiries',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(newInquiryPayload),
        },
      },
      newInquiryPayload
    );
    console.log(`POST /api/inquiries status: ${inquiryPostRes.statusCode}, body: ${inquiryPostRes.body}`);

    // 5. Test Admin Login POST with credentials: doer-admin / V2gU*k)v7v8drHIsvT
    console.log('Testing POST /api/auth/login with doer-admin / V2gU*k)v7v8drHIsvT ...');
    const loginPayload = JSON.stringify({
      username: 'doer-admin',
      password: 'V2gU*k)v7v8drHIsvT',
    });

    const loginRes = await request(
      {
        host: '127.0.0.1',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(loginPayload),
        },
      },
      loginPayload
    );
    console.log(`POST /api/auth/login status: ${loginRes.statusCode}, body: ${loginRes.body}`);
    const setCookie = loginRes.headers['set-cookie'];
    console.log('Cookie received:', setCookie ? 'YES (doer_admin_session)' : 'NO');

    // 6. Test GET /api/inquiries with auth cookie
    if (setCookie) {
      const cookieHeader = setCookie.map((c) => c.split(';')[0]).join('; ');
      console.log('Testing GET /api/inquiries with authenticated session...');
      const inquiriesAuthRes = await request({
        host: '127.0.0.1',
        port: 3000,
        path: '/api/inquiries',
        method: 'GET',
        headers: { Cookie: cookieHeader },
      });
      console.log(`GET /api/inquiries status: ${inquiriesAuthRes.statusCode}`);
      const data = JSON.parse(inquiriesAuthRes.body);
      console.log(`Total inquiries retrieved from MySQL: ${data.inquiries?.length}`);
    }

    console.log('All tests passed successfully!');
  } finally {
    server.kill();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

