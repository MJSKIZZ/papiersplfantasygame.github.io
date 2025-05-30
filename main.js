const users = {
  "Manny": { code: "2010", admin: true },
  "Cody": { code: "9841", admin: false },
  "Jesse": { code: "1735", admin: false },
  "Papa": { code: "6298", admin: true },
  "Paul": { code: "4072", admin: false },
  "Nick": { code: "8553", admin: false },
};

document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const code = document.getElementById("code").value;
  const user = users[username];

  if (user && user.code === code) {
    localStorage.setItem("username", username);
    localStorage.setItem("isAdmin", user.admin);
    window.location.href = "predictions.html"; // redirect to prediction page
  } else {
    document.getElementById("loginStatus").textContent = "Invalid login. Try again.";
  }
});
