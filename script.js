document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('paymentsTable');
    const radios = table.querySelectorAll('input[type="radio"]');

    // Load saved states
    radios.forEach(radio => {
        const personId = radio.getAttribute('data-person');
        const savedState = localStorage.getItem(`paidPerson${personId}`);
        if (savedState === 'checked') {
            radio.checked = true;
            strikeThroughRow(personId);
        }
    });

    function updateTotals() {
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const amounts = row.querySelectorAll('.amount');
            const totalPaid = row.querySelector('.total-paid');
            const totalReceived = row.querySelector('.total-received');
            let paid = 0;
            let received = 0;
            
            amounts.forEach(amountCell => {
                const value = parseInt(amountCell.textContent.replace('R', ''));
                if (value === 1500) {
                    received += value;
                    // Ensure R0 payment in the month of receiving
                    amountCell.textContent = `R0`;
                } else {
                    paid += value;
                }
            });

            totalPaid.textContent = `R${paid}`;
            totalReceived.textContent = `R${received}`;
        });
    }

    function strikeThroughRow(personId) {
        const row = table.querySelector(`tbody tr:nth-child(${personId})`);
        row.classList.add('struck-through');
    }

    function removeStrikeThroughRow(personId) {
        const row = table.querySelector(`tbody tr:nth-child(${personId})`);
        row.classList.remove('struck-through');
    }

    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            const personId = this.getAttribute('data-person');
            const isChecked = this.checked;

            if (isChecked) {
                // Set the selected radio button in local storage and strike through the row
                localStorage.setItem(`paidPerson${personId}`, 'checked');
                strikeThroughRow(personId);
            } else {
                // If unchecked, remove the saved state and strike-through
                localStorage.removeItem(`paidPerson${personId}`);
                removeStrikeThroughRow(personId);
            }

            // Ensure all other persons' states are preserved
            radios.forEach(r => {
                if (r !== this) {
                    const otherPersonId = r.getAttribute('data-person');
                    if (localStorage.getItem(`paidPerson${otherPersonId}`) === 'checked') {
                        strikeThroughRow(otherPersonId);
                    } else {
                        removeStrikeThroughRow(otherPersonId);
                    }
                }
            });
        });

        radio.addEventListener('contextmenu', function(event) {
            event.preventDefault(); // Prevent the default context menu
            const personId = this.getAttribute('data-person');
            this.checked = false; // Uncheck the radio button
            localStorage.removeItem(`paidPerson${personId}`); // Remove the saved state
            removeStrikeThroughRow(personId); // Remove strike-through effect
            updateTotals(); // Update totals after change
        });
    });
    
    updateTotals();
});
