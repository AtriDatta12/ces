fetch('http://localhost:5000/api/auth/admin/login', {  // Update this URL
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: adminUsername,
    password: adminPassword
  })
})