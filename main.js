const rules = {
  first_name: [{ required: true, message: "First Name is Required" }],
  last_name: [{ required: true, message: "Last Name is Required" }],
  email: [
    { required: true, message: "Email is Required" },
    {
      pattern: /^[^\s;]+@[^\s;]+\.[^\s;]+(?:;[^\s;]+@[^\s;]+\.[^\s;]+)*$/,
      message: "Please Enter a valid mail",
    },
  ],
  phone: [
    { required: true, message: "phone is Required" },
    { pattern: /^[0-9]*$/, message: "Please Enter a valid phone" },
  ],
  password: [{ required: true, message: "password is Required" }],
  confirm_password: [
    { required: true, message: "confirm password is Required" },
    {
      customValidation: (field) => {
        const passwordField = document.querySelector("#password");
        return passwordField.value === field.value;
      },
      message: "confirm password doesn't match the password Field",
    },
  ],
};

const formElem = document.querySelector("form");
const formItems = formElem.querySelectorAll("input");
formItems.forEach((fi) =>
  fi.addEventListener("input", (e) => {
    console.log(e.target.value);
    validateField(e.target);
  })
);
formElem.onsubmit = (e) => {
  for (let i = 0; i < formItems.length; i++) {
    const formItem = formItems[i];
    validateField(formItem);
  }
  e.preventDefault();
};

function validateField(field) {
  const fieldRules = rules[field.id];
  if (!fieldRules || !fieldRules.length) return;
  const fieldValue = field.value;
  let hadError = false;
  for (let i = 0; i < fieldRules.length; i++) {
    const rule = fieldRules[i];
    // check if rule type is required
    if ("required" in rule) {
      if (!fieldValue) {
        showErrorMessage(field, rule.message);
        hadError = true;
        break;
      }
    }
    if ("pattern" in rule) {
      const { pattern } = rule;
      if (fieldValue && pattern instanceof RegExp) {
        if (!pattern.test(fieldValue)) {
          showErrorMessage(field, rule.message);
          hadError = true;
          break;
        }
      }
    }
    if ("customValidation" in rule) {
      if (!rule.customValidation(field)) {
        showErrorMessage(field, rule.message);
        hadError = true;
        break;
      }
    }
  }
  if (!hadError) {
    removeOldMessage(field);
  }
}

function showErrorMessage(field, message = "") {
  removeOldMessage(field);
  const errorElement = document.createElement("div");
  errorElement.classList.add("error-message");
  errorElement.textContent = message;
  field.classList.add("invalid");
  field.parentNode.appendChild(errorElement);
}
function removeOldMessage(field) {
  const oldErrMessage = field.parentNode.querySelector(".error-message");
  field.classList.remove("invalid");
  if (oldErrMessage) oldErrMessage.remove();
}
