/* ============================================================
   BoroughScope — NYC Airbnb room-type predictor front end
   Talks to a FastAPI /predict endpoint (see index.html footer)
   ============================================================ */

const CLASS_META = {
  "Entire home/apt": { color: "#F5B942", dim: "#4A3D1D", short: "Entire home/apt" },
  "Private room":    { color: "#4ECDC4", dim: "#1B3B38", short: "Private room" },
  "Shared room":     { color: "#FF6B7A", dim: "#4A2226", short: "Shared room" },
};

const NEIGHBOURHOODS = {
  "Manhattan": ["Harlem","Upper West Side","Upper East Side","Chelsea","East Village","West Village","Midtown","Hell's Kitchen","SoHo","Chinatown","Financial District","Washington Heights","Murray Hill","Inwood"],
  "Brooklyn": ["Williamsburg","Bushwick","Bedford-Stuyvesant","Park Slope","Greenpoint","Crown Heights","Fort Greene","Sunset Park","Flatbush","Brooklyn Heights","Bushwick","DUMBO"],
  "Queens": ["Astoria","Long Island City","Flushing","Ridgewood","Jamaica","Sunnyside","Forest Hills","Elmhurst","Woodside"],
  "Bronx": ["Fordham","Mott Haven","Riverdale","Concourse","Kingsbridge","Belmont"],
  "Staten Island": ["St. George","Tompkinsville","Stapleton","New Brighton","Great Kills"]
};

const state = {
  neighbourhood_group: null,
  endpoint: localStorage.getItem("bs_endpoint") || "http://localhost:8000/predict"
};

/* ---------------- skyline background ---------------- */
function buildSkyline(){
  const svg = document.getElementById("skylineSvg");
  const W = 1600, H = 400;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  let x = -20;
  let z = 0;
  const layers = [
    { yBase: H, hMin: 60,  hMax: 150, wMin: 40, wMax: 80,  fill: "#0d1119", winOpacityMax: .5 },
    { yBase: H, hMin: 110, hMax: 240, wMin: 46, wMax: 90,  fill: "#0f1420", winOpacityMax: .8 },
    { yBase: H, hMin: 160, hMax: 320, wMin: 50, wMax: 100, fill: "#121826", winOpacityMax: 1 },
  ];
  let svgMarkup = "";
  layers.forEach((layer, li) => {
    x = -30 - li * 15;
    while (x < W + 30){
      const w = rand(layer.wMin, layer.wMax);
      const h = rand(layer.hMin, layer.hMax);
      const y = layer.yBase - h;
      svgMarkup += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${layer.fill}"></rect>`;
      // windows
      const cols = Math.max(2, Math.floor(w / 12));
      const rows = Math.max(2, Math.floor(h / 16));
      for (let r = 0; r < rows; r++){
        for (let c = 0; c < cols; c++){
          if (Math.random() > 0.4) continue;
          const wx = x + 5 + c * (w - 10) / cols;
          const wy = y + 8 + r * (h - 16) / rows;
          const delay = (Math.random() * 6).toFixed(2);
          const dur = (3 + Math.random() * 4).toFixed(2);
          const maxOp = (layer.winOpacityMax * (0.5 + Math.random() * 0.5)).toFixed(2);
          svgMarkup += `<rect class="win" x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="3.2" height="4.2" fill="#F5B942" style="--max-op:${maxOp}; animation-delay:${delay}s; animation-duration:${dur}s;"></rect>`;
        }
      }
      x += w + rand(4, 14);
    }
  });
  svg.innerHTML = svgMarkup;

  // inject twinkle keyframes once
  if (!document.getElementById("twinkleStyle")){
    const style = document.createElement("style");
    style.id = "twinkleStyle";
    style.textContent = `
      .win{ opacity: .08; animation-name: twinkle; animation-iteration-count: infinite; animation-timing-function: ease-in-out; }
      @keyframes twinkle{ 0%,100%{ opacity:.08; } 45%{ opacity:.08;} 55%{ opacity: var(--max-op, .8);} 90%{opacity: var(--max-op,.8);} }
    `;
    document.head.appendChild(style);
  }
}
function rand(a,b){ return a + Math.random() * (b - a); }

/* ---------------- borough chips ---------------- */
function initChips(){
  const chips = document.querySelectorAll(".chip");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      state.neighbourhood_group = chip.dataset.value;
      document.getElementById("neighbourhood_group").value = state.neighbourhood_group;
      populateNeighbourhoods(state.neighbourhood_group);
      updateFillCount();
    });
  });
}

function populateNeighbourhoods(borough){
  const list = document.getElementById("neighbourhoodList");
  list.innerHTML = "";
  (NEIGHBOURHOODS[borough] || []).forEach(n => {
    const opt = document.createElement("option");
    opt.value = n;
    list.appendChild(opt);
  });
}

/* ---------------- fill counter ---------------- */
function getAllFieldIds(){
  return ["neighbourhood","price","latitude","longitude","minimum_nights",
          "availability_365","number_of_reviews","reviews_per_month",
          "calculated_host_listings_count"];
}

function updateFillCount(){
  const ids = getAllFieldIds();
  let filled = state.neighbourhood_group ? 1 : 0;
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.value.trim() !== "") filled++;
  });
  const total = ids.length + 1;
  const tag = document.getElementById("fillTag");
  tag.textContent = `${filled} / ${total} filled`;
  tag.classList.toggle("full", filled === total);
}

function initFillTracking(){
  getAllFieldIds().forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", updateFillCount);
  });
}

/* ---------------- prediction ---------------- */
function collectPayload(){
  return {
    latitude: parseFloat(document.getElementById("latitude").value),
    longitude: parseFloat(document.getElementById("longitude").value),
    price: parseFloat(document.getElementById("price").value),
    minimum_nights: parseInt(document.getElementById("minimum_nights").value, 10),
    number_of_reviews: parseInt(document.getElementById("number_of_reviews").value, 10),
    reviews_per_month: parseFloat(document.getElementById("reviews_per_month").value),
    calculated_host_listings_count: parseInt(document.getElementById("calculated_host_listings_count").value, 10),
    availability_365: parseInt(document.getElementById("availability_365").value, 10),
    neighbourhood_group: state.neighbourhood_group,
    neighbourhood: document.getElementById("neighbourhood").value.trim(),
  };
}

function validatePayload(p){
  if (!p.neighbourhood_group) return "Pick a borough first.";
  if (!p.neighbourhood) return "Neighbourhood can't be empty.";
  for (const [k,v] of Object.entries(p)){
    if (typeof v === "number" && Number.isNaN(v)) return `Check the "${k.replace(/_/g," ")}" field.`;
  }
  return null;
}

async function runPrediction(e){
  e.preventDefault();
  const errorEl = document.getElementById("formError");
  errorEl.textContent = "";

  const payload = collectPayload();
  const problem = validatePayload(payload);
  if (problem){
    errorEl.textContent = problem;
    return;
  }

  const btn = document.getElementById("predictBtn");
  btn.classList.add("loading");
  btn.disabled = true;

  try{
    const res = await fetch(state.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok){
      const detail = await res.text();
      throw new Error(`Server responded ${res.status}: ${detail.slice(0,180)}`);
    }
    const data = await res.json();
    renderResult(data);
  }catch(err){
    errorEl.textContent = `Couldn't reach the model — ${err.message}. Check the API endpoint (top right).`;
  }finally{
    btn.classList.remove("loading");
    btn.disabled = false;
  }
}

function renderResult(data){
  const predicted = data.Predicted_room_type;
  const probs = data.Probability || [];
  const classOrder = ["Entire home/apt","Private room","Shared room"];

  const meta = CLASS_META[predicted] || { color: "#8B93A6", dim: "#232838" };

  document.getElementById("resultIdle").style.display = "none";
  const flip = document.getElementById("resultFlip");
  flip.classList.remove("show");
  void flip.offsetWidth; // restart animation
  flip.classList.add("show");

  document.getElementById("resultType").textContent = predicted;
  document.getElementById("resultType").style.color = meta.color;

  const map = document.getElementById("mapPin");
  map.classList.add("active");
  document.documentElement.style.setProperty("--accent", meta.color);
  map.querySelector(".pin").style.background = meta.color;
  map.querySelectorAll(".pulse-ring").forEach(r => r.style.borderColor = meta.color);

  const list = document.getElementById("probList");
  list.innerHTML = "";
  classOrder.forEach((cls, i) => {
    const pct = (probs[i] !== undefined ? probs[i] : 0) * 100;
    const cMeta = CLASS_META[cls];
    const row = document.createElement("div");
    row.className = "prob-row";
    row.innerHTML = `
      <div class="prob-top">
        <span class="prob-name">${cls}</span>
        <span class="prob-pct">${pct.toFixed(1)}%</span>
      </div>
      <div class="prob-track">
        <div class="prob-fill" style="background:${cMeta.color};"></div>
      </div>
    `;
    list.appendChild(row);
    requestAnimationFrame(() => {
      setTimeout(() => {
        row.querySelector(".prob-fill").style.width = `${pct}%`;
      }, 60 + i * 90);
    });
  });
}

/* ---------------- endpoint drawer ---------------- */
function initDrawer(){
  const toggle = document.getElementById("endpointToggle");
  const drawer = document.getElementById("endpointDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  const input = document.getElementById("endpointInput");
  const label = document.getElementById("endpointLabel");

  input.value = state.endpoint;
  label.textContent = state.endpoint;

  function open(){ drawer.classList.add("open"); backdrop.classList.add("open"); input.focus(); }
  function close(){ drawer.classList.remove("open"); backdrop.classList.remove("open"); }

  toggle.addEventListener("click", open);
  backdrop.addEventListener("click", close);
  document.getElementById("drawerCancel").addEventListener("click", close);
  document.getElementById("drawerSave").addEventListener("click", () => {
    const val = input.value.trim();
    if (val){
      state.endpoint = val;
      localStorage.setItem("bs_endpoint", val);
      label.textContent = val;
    }
    close();
  });
}

/* ---------------- init ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  buildSkyline();
  initChips();
  initFillTracking();
  initDrawer();
  updateFillCount();
  document.getElementById("predictForm").addEventListener("submit", runPrediction);
});
