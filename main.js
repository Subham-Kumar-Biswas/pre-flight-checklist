// Status part
let status = {
  "activePhaseIndex": 0,
  "completedPhases": [],
  "checklistProgress": {
    "PILOT_FITNESS": { "illness": false, "medication": false, "stress": false, "alcohol": false, "fatigue": false, "emotion": false },
    "AIRCRAFT_CABIN": { "control-lock": false, "ignition-switch": false, "master-switch": false, "fuel-quantity": false, "flaps-switch": false, "master-switch-off": false },
    "PROPULSION_START": { "fuel-selector": false, "mixture-control": false, "throttle-lever": false, "propeller-area": false, "starter-engage": false }
  },
  "systemStatus": "LOCKED" 
};

// Metadata Mapping Objects to DOM Class Selector
const PHASE_MAPPING = [
  {name : "PILOT_FITNESS", classSelector : ".pilot-fitness"},
  {name : "AIRCRAFT_CABIN", classSelector : ".aircraft-cabin"},
  {name : "PROPULSION_START", classSelector : ".propulsion-start"}
];

// UI CONTROLS
const uiControls = {
  transitionBtn : document.getElementById('btn-transition'),
  stepNodes : document.querySelectorAll('.step-node')
};

// Phases Selecting
function initDOMHooks() {
  PHASE_MAPPING.forEach(phase => {
    phase.element = document.querySelector(phase.classSelector);
  });
};

function bindInputListeners() {
  const checkboxes = (document.querySelectorAll('input[type="checkbox"]'));

  checkboxes.forEach(box => {
    box.addEventListener('change', (event) => {
      const checkboxId = event.target.id;

      const isChecked = event.target.checked;

      const currentPhaseName = PHASE_MAPPING[status.activePhaseIndex].name;

      status.checklistProgress[currentPhaseName][checkboxId] = isChecked;
      console.log(status.checklistProgress[currentPhaseName]);

      validateActivePhase();
    });
  });
}

function validateActivePhase() {
  const currentPhaseName = PHASE_MAPPING[status.activePhaseIndex].name;

  const currentPhaseValues = Object.values(status.checklistProgress[currentPhaseName]);

  const isCompleted = currentPhaseValues.every(value => value === true);

  if (isCompleted) {
    status.systemStatus = "UNLOCKED";
    uiControls.transitionBtn.removeAttribute('disabled');
    console.log("Phase compliant. Authorization system UNLOCKED.");
  } else {
    status.systemStatus = "LOCKED";
    uiControls.transitionBtn.setAttribute('disabled', 'true');
  };
};

function handlePhaseTransition() {
  status.activePhaseIndex++;

  if (status.activePhaseIndex === PHASE_MAPPING.length) {
    alert("FLIGHT READY!");
    status.systemStatus = "FLIGHT_READY";

    uiControls.transitionBtn.setAttribute('disabled', 'true');

    uiControls.stepNodes[status.activePhaseIndex - 1].classList.add('completed');
    uiControls.stepNodes[status.activePhaseIndex - 1].classList.remove('active');
    return;    
  } else {
    PHASE_MAPPING[status.activePhaseIndex - 1].element.classList.add('hidden');
    PHASE_MAPPING[status.activePhaseIndex].element.classList.remove('hidden');

    uiControls.stepNodes[status.activePhaseIndex - 1].classList.add('completed');
    uiControls.stepNodes[status.activePhaseIndex - 1].classList.remove('active');

    uiControls.stepNodes[status.activePhaseIndex].classList.add('active');
    uiControls.stepNodes[status.activePhaseIndex].classList.remove('locked');

    uiControls.stepNodes[status.activePhaseIndex - 1].removeAttribute('aria-current');
    uiControls.stepNodes[status.activePhaseIndex].setAttribute('aria-current', "step");

    status.systemStatus = "LOCKED";
    uiControls.transitionBtn.setAttribute('disabled', 'true');
  };
};

function initializeApp() {
  initDOMHooks();
  bindInputListeners();
  uiControls.transitionBtn.addEventListener('click', handlePhaseTransition);
}
 
window.addEventListener('DOMContentLoaded', initializeApp);
