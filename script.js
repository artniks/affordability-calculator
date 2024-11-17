let salary = 100000;

function formatNumberWithCommas(input) {
  // Remove any non-digit characters
  let value = input.value.replace(/\D/g, '');

  // Format with commas
  if (value.length > 0) {
    value = parseInt(value).toLocaleString('en-US');
    salary = parseInt(value.replace(/,/g, '')); // Update the salary variable
    updateCardValues(); // Update all card values when input changes
  }

  // Update the input value
  input.value = value;
}

function makeSpansEditable() {
  const spans = document.querySelectorAll('.card-headline span');

  spans.forEach(span => {
    // Make sure contentEditable is set as a string
    span.setAttribute('contenteditable', 'true');

    // Handle input events
    span.addEventListener('input', (e) => {
      let value = e.target.textContent.replace(/[^0-9]/g, '');
      if (value === '') value = '0';
      e.target.textContent = `${value}%`;

      // Keep cursor at the end
      const range = document.createRange();
      const sel = window.getSelection();
      range.setStart(e.target.childNodes[0], value.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);

      updateCardValues();
    });

    // Handle focus events
    span.addEventListener('focus', (e) => {
      let text = e.target.textContent;
      e.target.textContent = text.replace('%', '');
    });

    span.addEventListener('blur', (e) => {
      let value = parseInt(e.target.textContent) || 0;
      e.target.textContent = `${value}%`;
      updateCardValues();
    });

    // Prevent enter key from creating new lines
    span.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        span.blur();
      }
    });
  });
}

function updateCardValues() {
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    const percentageSpan = card.querySelector('span');
    if (percentageSpan) {
      const percentage = parseInt(percentageSpan.textContent) / 100;
      const monthlyAmount = (salary * percentage) / 12;

      let amountLabel = card.querySelector('.amount-label');
      if (!amountLabel) {
        amountLabel = document.createElement('p');
        amountLabel.className = 'amount-label';
        card.appendChild(amountLabel);
      }

      amountLabel.textContent = `$${Math.round(monthlyAmount).toLocaleString()}`;
    }
  });
}

// Add event listener when the document loads
document.addEventListener('DOMContentLoaded', () => {
  const salaryInput = document.querySelector('.header input');

  salaryInput.addEventListener('input', (e) => {
    formatNumberWithCommas(e.target);
  });

  makeSpansEditable();
  updateCardValues();
});
