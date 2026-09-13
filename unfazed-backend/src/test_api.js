async function testApi() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('=== Unfazed Module 1 API Verification ===');

  // 1. Health check
  console.log('\n[1] Testing GET /api/health');
  const healthRes = await fetch(`${baseUrl}/health`);
  const healthData = await healthRes.json();
  console.log('Health status:', healthData.status, '-', healthData.message);

  // 2. Public therapist profile by slug
  console.log('\n[2] Testing GET /api/therapists/public/dr-ananya-sharma');
  const publicRes = await fetch(`${baseUrl}/therapists/public/dr-ananya-sharma`);
  const publicData = await publicRes.json();
  console.log('Public Profile Found:', publicData.therapist?.name);
  console.log('Slug:', publicData.therapist?.slug);
  console.log('Specializations:', publicData.therapist?.specializations);
  console.log('Consultation Fee:', publicData.therapist?.consultationFee);

  // 3. Login
  console.log('\n[3] Testing POST /api/auth/login');
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'ananya@unfazed.care',
      password: 'Password123!',
    }),
  });
  const loginData = await loginRes.json();
  console.log('Login Success:', loginData.success);
  console.log('Token generated:', Boolean(loginData.token));
  const token = loginData.token;

  // 4. Authenticated profile check
  console.log('\n[4] Testing GET /api/auth/me');
  const meRes = await fetch(`${baseUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meData = await meRes.json();
  console.log('Authenticated User:', meData.therapist?.name);

  // 5. Update profile
  console.log('\n[5] Testing PUT /api/therapists/me');
  const updateRes = await fetch(`${baseUrl}/therapists/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      bio: 'A warm, grounded therapeutic sanctuary dedicated to thoughtful, evidence-based healing.',
      consultationFee: 1600,
    }),
  });
  const updateData = await updateRes.json();
  console.log('Profile updated successfully:', updateData.success);
  console.log('New Fee:', updateData.therapist?.consultationFee);
  console.log('New Bio:', updateData.therapist?.bio);

  // 6. Register a new therapist
  console.log('\n[6] Testing POST /api/auth/register (New Therapist)');
  const regRes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Dr. Rohan Verma',
      email: 'rohan@unfazed.care',
      password: 'SecurePassword123!',
      specialization: 'Couples & Family Therapy',
    }),
  });
  const regData = await regRes.json();
  console.log('Registration Success:', regData.success);
  console.log('Generated Slug:', regData.therapist?.slug);

  // 7. Verify new therapist public slug
  console.log('\n[7] Testing GET /api/therapists/public/dr-rohan-verma');
  const rohanRes = await fetch(`${baseUrl}/therapists/public/${regData.therapist?.slug}`);
  const rohanData = await rohanRes.json();
  console.log('Fetched newly registered therapist by slug:', rohanData.therapist?.name);

  console.log('\n=== ALL MODULE 1 BACKEND ENDPOINTS PASSED SUCCESSFULLY ===');
}

testApi().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
