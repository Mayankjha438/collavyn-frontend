// ==============================
// COLLAVYN - Main JS (All in One)
// Creators + Brands = Growth
// Includes: Auth, Creator/Brand Separate Login, Campaigns, UI
// ==============================

// --- CONFIG ---
const API_URL = "https://collavyn-backend.onrender.com/api";
let currentRole = 'creator';

// --- UI FUNCTIONS ---
function openLogin(role){
  currentRole = role;
  const modal = document.getElementById('loginModal');
  if(!modal) return;
  modal.style.display='flex';
  document.getElementById('roleText').innerText = role;
  document.getElementById('loginTitle').innerText = role === 'creator' ? 'Creator Login' : 'Brand Login';
  // Change button color based on role
  const btn = modal.querySelector('.btn-primary');
  if(role === 'brand'){
    btn.style.background = 'linear-gradient(90deg,#3B82F6,#6366F1)';
  } else {
    btn.style.background = 'linear-gradient(90deg,#A855F7,#6366F1)';
  }
}

function closeLogin(){
  document.getElementById('loginModal').style.display='none';
}

// --- AUTH - Separate Login for Creator & Brand ---
async function login(){
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  if(!email || !password){
    alert('Email aur Password daal bhai!');
    return;
  }

  try{
    const res = await fetch(`${API_URL}/auth/login`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({email, password})
    });
    const data = await res.json();
    
    if(data.token){
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert(`Welcome ${data.user.name}! Logged in as ${currentRole} ✅`);
      closeLogin();
      window.location.href = currentRole === 'creator' ? '#creator-dashboard' : '#brand-dashboard';
    } else {
      alert(data.msg || 'Login failed');
    }
  }catch(err){
    // If backend not running, still demo
    console.log('Backend offline, demo mode');
    localStorage.setItem('role', currentRole);
    alert(`Demo Login as ${currentRole}: ${email}\n(Backend connect karne par real auth chalega)`);
    closeLogin();
  }
}

async function register(){
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  
  try{
    const res = await fetch(`${API_URL}/auth/register`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({name, email, password})
    });
    const data = await res.json();
    if(data.token){
      alert('Registration Successful! Ab login karo.');
    }
  }catch(err){alert('Error: '+err.message)}
}

// --- CREATORS & BRANDS FETCH ---
async function fetchCreators(){
  try{
    const res = await fetch(`${API_URL}/creators`);
    const creators = await res.json();
    console.log('Creators:', creators);
    // Render in UI if needed
  }catch(e){console.log('Using demo creators')}
}

async function fetchCampaigns(){
  try{
    const res = await fetch(`${API_URL}/campaigns`);
    const campaigns = await res.json();
    console.log('Campaigns:', campaigns);
  }catch(e){console.log('Demo campaigns')}
}

// --- SCROLL & NAV ---
function initScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener('click', function(e){
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(target) target.scrollIntoView({behavior:'smooth'});
    });
  });
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', ()=>{
  initScroll();
  fetchCreators();
  fetchCampaigns();
  console.log('COLLAVYN Main JS Loaded - Where Brands Meet Creators');
});

// Close modal on outside click
window.onclick = function(event){
  const modal = document.getElementById('loginModal');
  if(event.target == modal) closeLogin();
}
