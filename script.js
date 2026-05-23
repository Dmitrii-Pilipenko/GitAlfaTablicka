document.addEventListener("DOMContentLoaded", () => {
    
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwg83mzLOxzVUAP4b_bEgnx7zVflQ1k3DMBgtJ1QitjoAKs0Mt_MtuC3N3kOS2Y0uH5/exec";


    const amountInput = document.getElementById("calculate-input");
    const periodButtons = document.querySelectorAll(".main-button");
    
    const rateAllElement = document.getElementById("rate-all");
    const rateOnlyElement = document.getElementById("rate-only");
    
    const profitAllElement = document.getElementById("profit-all");
    const profitOnlyElement = document.getElementById("profit-only");
    
    const totalAllElement = document.getElementById("total-all");
    const totalOnlyElement = document.getElementById("total-only");

    const kapitalContainer = document.querySelector('input[data-name="kapital"]').closest('.uslovia');
    const popolnenieContainer = document.querySelector('input[data-name="popolnenie"]').closest('.uslovia');

    let currentRateAll = 13.00;
    let currentRateOnly = 13.50;

    function formatNumber(num) {
        return Math.round(num).toLocaleString('ru-RU') + " ₽";
    }

    function calculateVklad() {
        const principal = parseFloat(amountInput.value) || 0;
        
        const activePeriodButton = document.querySelector(".main-button.active-period");
        
        if (!activePeriodButton) {
            profitAllElement.textContent = "+ " + formatNumber(0);
            profitOnlyElement.textContent = "+ " + formatNumber(0);
            totalAllElement.textContent = formatNumber(principal);
            totalOnlyElement.textContent = formatNumber(principal);
            return;
        }
        
        const radioInput = activePeriodButton.querySelector('input[type="radio"]');
        const months = parseInt(radioInput.getAttribute("data-month")) || 12;
        
        const isKapitalOn = kapitalContainer.id === "turn-on";

        let totalAll, totalOnly;

        if (isKapitalOn) {
            totalAll = principal * Math.pow(1 + (currentRateAll / 100) / 12, months);
            totalOnly = principal * Math.pow(1 + (currentRateOnly / 100) / 12, months);
        } else {
            totalAll = principal + (principal * (currentRateAll / 100) * (months / 12));
            totalOnly = principal + (principal * (currentRateOnly / 100) * (months / 12));
        }

        const profitAll = totalAll - principal;
        const profitOnly = totalOnly - principal;

        profitAllElement.textContent = "+ " + formatNumber(profitAll);
        profitOnlyElement.textContent = "+ " + formatNumber(profitOnly);
        
        totalAllElement.textContent = formatNumber(totalAll);
        totalOnlyElement.textContent = formatNumber(totalOnly);
    }

    function updateRates() {
        const isKapitalOn = kapitalContainer.id === "turn-on";
        const isPopolnenieOn = popolnenieContainer.id === "turn-on";

        if (isKapitalOn && !isPopolnenieOn) {
            currentRateAll = 13.14; currentRateOnly = 13.65;
        } else if (!isKapitalOn && isPopolnenieOn) {
            currentRateAll = 11.50; currentRateOnly = 12.00;
        } else if (isKapitalOn && isPopolnenieOn) {
            currentRateAll = 11.61; currentRateOnly = 12.12;
        } else {
            currentRateAll = 13.00; currentRateOnly = 13.50;
        }

        rateAllElement.textContent = currentRateAll.toFixed(2).replace('.', ',') + "%";
        rateOnlyElement.textContent = currentRateOnly.toFixed(2).replace('.', ',') + "%";

        calculateVklad();
    }

    periodButtons.forEach(button => {
        button.addEventListener("click", () => {
            const isAlreadyActive = button.classList.contains("active-period");

            periodButtons.forEach(btn => btn.classList.remove("active-period"));
            
            if (!isAlreadyActive) {
                button.classList.add("active-period");
            }
            
            calculateVklad();
        });
    });

    const usloviaButtons = document.querySelectorAll(".uslovia-button");
    usloviaButtons.forEach(button => {
        button.addEventListener("click", () => {
            const container = button.closest('.uslovia');
            console.log(button)
            if (container.id === "turn-on") {
                container.removeAttribute("id");
            } else {
                container.setAttribute("id", "turn-on");
            }
            
            updateRates();
            
            if (document.getElementById("choose-button")) {
                document.getElementById("choose-button").id = "";
            }
        });
    });
    amountInput.addEventListener("input", calculateVklad);

    updateRates();
    let status = document.querySelectorAll('#status');
    const submitButton = document.getElementById("submit");
    const form = document.querySelector('form');
    console.log(submitButton);
    submitButton.addEventListener("click", async (e) => {
        console.log("Отправляем данные...");
        let formDataNew = {}
        let value = amountInput.value;
        console.log("value:", value)
        let periodContainerValue = document.querySelector(".main-button.active-period").children[0].value;
        // console.log(periodContainer.children[0].value)
        let first = document.querySelector('[data-name="kapital"]').checked
        let second = document.querySelector('[data-name="popolnenie"]').checked
        console.log(first, second)
        const data = {
          vklad: value,      // Замените на ваше значение
          srok: periodContainerValue,          // Замените на ваше значение
          kapital: first,     // Замените на ваше значение
          snatie: second       // Замените на ваше значение
        };
        console.log(data)
        e.preventDefault();
        status.textContent = "Отправляем данные...";
        try {
            console.log("2 Отправляем данные...");
            console.log(data);
            await fetch(SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                body: data
            });
            console.log("Данные успешно отправлены");
            status.textContent = "Данные успешно отправлены";
            
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
        }
    })
});