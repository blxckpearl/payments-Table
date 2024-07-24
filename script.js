document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('paymentsTable');
    const radios = table.querySelectorAll('input[type="radio"]');

    // Initialize radio button states based on local storage
    radios.forEach(radio => {
        const personId = radio.getAttribute('data-person');
        const savedState = localStorage.getItem(`paidPerson${personId}`);
        if (savedState === 'checked') {
            radio.checked = true;
            strikeThroughRow(personId);
        } else {
            radio.checked = false;
            removeStrikeThroughRow(personId);
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
                const value = parseInt(amountCell.textContent.replace('R', ''), 10);
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

            // Manage local storage and row strike-through based on the checked state
            if (isChecked) {
                localStorage.setItem(`paidPerson${personId}`, 'checked');
                strikeThroughRow(personId);
            } else {
                localStorage.removeItem(`paidPerson${personId}`);
                removeStrikeThroughRow(personId);
            }
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
