document.addEventListener('DOMContentLoaded', function() {
    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = `${button.dataset.tab}-tab`;
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Initialize all calculators
    initCalculators();
});

// ============ 1. LOT SIZE CALCULATOR ============
function initLotSizeCalculator() {
    const capitalInput = document.getElementById('ls-capital');
    const riskPercentInput = document.getElementById('ls-risk-percent');
    const riskMoneyInput = document.getElementById('ls-risk-money-value');
    const stopLossInput = document.getElementById('ls-stop-loss');
    const pipValueInput = document.getElementById('ls-pip-value');
    const calculateButton = document.getElementById('ls-calculate-button');
    const resultsDiv = document.getElementById('ls-results');
    
    // Result elements
    const riskMoneyEl = document.getElementById('ls-risk-money');
    const lotSizeEl = document.getElementById('ls-lot-size');
    const actualRiskEl = document.getElementById('ls-actual-risk');
    const adviceEl = document.getElementById('ls-advice');
    
    // Add event listeners for risk type toggle
    const riskPercentBtn = document.getElementById('ls-risk-percent-btn');
    const riskMoneyBtn = document.getElementById('ls-risk-money-btn');
    const riskPercentDiv = document.getElementById('ls-risk-percent-input');
    const riskMoneyDiv = document.getElementById('ls-risk-money-input');
    
    riskPercentBtn.addEventListener('click', function() {
        riskPercentBtn.classList.add('active');
        riskMoneyBtn.classList.remove('active');
        riskPercentDiv.classList.remove('hidden');
        riskMoneyDiv.classList.add('hidden');
    });
    
    riskMoneyBtn.addEventListener('click', function() {
        riskPercentBtn.classList.remove('active');
        riskMoneyBtn.classList.add('active');
        riskPercentDiv.classList.add('hidden');
        riskMoneyDiv.classList.remove('hidden');
    });
    
    calculateButton.addEventListener('click', function() {
        const isPercentCalculation = riskPercentBtn.classList.contains('active');
        
        // Validate capital, stop loss, and pip value inputs
        const commonInputs = [
            { el: capitalInput, name: 'ขนาดพอร์ต', min: 1 },
            { el: stopLossInput, name: 'Stop Loss', min: 1 },
            { el: pipValueInput, name: 'Pip Value', min: 0.01 }
        ];
        
        if (!validateInputs(commonInputs)) return;
        
        // Get common input values
        const capital = parseFloat(capitalInput.value);
        const stopLoss = parseFloat(stopLossInput.value);
        const pipValue = parseFloat(pipValueInput.value);
        
        // Calculate risk money based on input type
        let riskMoney;
        
        if (isPercentCalculation) {
            // Validate risk percent input
            if (!validateInputs([
                { el: riskPercentInput, name: 'Risk Percent', min: 0.01, max: 100 }
            ])) return;
            
            const riskPercent = parseFloat(riskPercentInput.value);
            riskMoney = (capital * riskPercent) / 100;
        } else {
            // Validate risk money input
            if (!validateInputs([
                { el: riskMoneyInput, name: 'Risk Money', min: 1 }
            ])) return;
            
            riskMoney = parseFloat(riskMoneyInput.value);
            // Ensure risk money doesn't exceed capital
            if (riskMoney > capital) {
                alert('ความเสี่ยงต่อการเทรดไม่ควรเกินขนาดพอร์ต');
                return;
            }
        }
        
        // Calculate lot size
        const calculatedLotSize = riskMoney / (stopLoss * pipValue);
        
        // Round down to 2 decimal places
        const recommendedLotSize = Math.floor(calculatedLotSize * 100) / 100;
        
        // Calculate actual risk with recommended lot size
        const actualRisk = recommendedLotSize * stopLoss * pipValue;
        const riskPercent = (actualRisk / capital) * 100;
        
        // Display results
        riskMoneyEl.textContent = `$${riskMoney.toFixed(2)}`;
        lotSizeEl.textContent = `${recommendedLotSize.toFixed(2)} lot`;
        actualRiskEl.textContent = `$${actualRisk.toFixed(2)} (${riskPercent.toFixed(2)}%)`;
        
        // Generate advice based on risk percentage
        let advice = '';
        
        if (riskPercent <= 1) {
            advice = 'คุณกำลังใช้ความเสี่ยงต่ำมาก (Conservative) ซึ่งปลอดภัยแต่อาจทำให้การเติบโตของพอร์ตช้า';
        } else if (riskPercent <= 2) {
            advice = 'คุณกำลังใช้ความเสี่ยงที่เหมาะสม (Moderate) ซึ่งสมดุลระหว่างความปลอดภัยและการเติบโต';
        } else if (riskPercent <= 3) {
            advice = 'คุณกำลังใช้ความเสี่ยงปานกลาง-สูง (Aggressive) ควรระมัดระวังและมีระบบเทรดที่มั่นใจ';
        } else if (riskPercent <= 5) {
            advice = 'คุณกำลังใช้ความเสี่ยงสูง (Very Aggressive) ไม่แนะนำสำหรับผู้เทรดมือใหม่';
        } else {
            advice = 'คำเตือน: คุณกำลังใช้ความเสี่ยงสูงมาก (Extremely Risky) ซึ่งอาจนำไปสู่การสูญเสียเงินอย่างรวดเร็ว';
        }
        
        adviceEl.textContent = advice;
        
        // Show results
        resultsDiv.classList.remove('hidden');
    });
}

// ============ 2. SL & TP CALCULATOR ============
function initSLTPCalculator() {
    const orderTypeSelect = document.getElementById('sltp-order-type');
    const entryPriceInput = document.getElementById('sltp-entry-price');
    const slPipsInput = document.getElementById('sltp-sl-pips');
    const tpPipsInput = document.getElementById('sltp-tp-pips');
    const slMoneyInput = document.getElementById('sltp-sl-money');
    const tpMoneyInput = document.getElementById('sltp-tp-money');
    const pipValueInput = document.getElementById('sltp-pip-value');
    const lotSizeInput = document.getElementById('sltp-lot-size');
    const calculateButton = document.getElementById('sltp-calculate-button');
    const resultsDiv = document.getElementById('sltp-results');
    
    // Result elements
    const slResultEl = document.getElementById('sltp-sl-result');
    const tpResultEl = document.getElementById('sltp-tp-result');
    const slPipResultEl = document.getElementById('sltp-sl-pip-result');
    const tpPipResultEl = document.getElementById('sltp-tp-pip-result');
    const riskValueEl = document.getElementById('sltp-risk-value');
    const profitValueEl = document.getElementById('sltp-profit-value');
    const rrResultEl = document.getElementById('sltp-rrr');
    const adviceEl = document.getElementById('sltp-advice');
    
    // Add event listeners for calculation choice
    const byPipBtn = document.getElementById('sltp-by-pip-btn');
    const byPriceBtn = document.getElementById('sltp-by-price-btn');
    const byPipDiv = document.getElementById('sltp-by-pip');
    const byPriceDiv = document.getElementById('sltp-by-price');
    
    byPipBtn.addEventListener('click', function() {
        byPipBtn.classList.add('active');
        byPriceBtn.classList.remove('active');
        byPipDiv.classList.remove('hidden');
        byPriceDiv.classList.add('hidden');
    });
    
    byPriceBtn.addEventListener('click', function() {
        byPipBtn.classList.remove('active');
        byPriceBtn.classList.add('active');
        byPipDiv.classList.add('hidden');
        byPriceDiv.classList.remove('hidden');
    });

    function detectPipSize(price) {
        const str = price.toString();
    
        // ตรวจสอบว่ามีจุดทศนิยมหรือไม่
        if (!str.includes('.')) {
            return 1; // ไม่มีจุดทศนิยม เช่น 34000 → pip = 1
        }
    
        const decimalPlaces = str.split('.')[1].length;
    
        if (decimalPlaces >= 5) {
            return 0.0001; // เช่น 1.12345 → pip อยู่ตำแหน่งที่ 4
        } else if (decimalPlaces === 4) {
            return 0.0001;
        } else if (decimalPlaces === 3) {
            return 0.01;
        } else if (decimalPlaces === 2) {
            return 0.01;
        } else if (decimalPlaces === 1) {
            return 0.1;
        } else {
            return 1; // fallback
        }
    }
    
    // Helper function to calculate pips from price difference
    function calculatePips(fromPrice, toPrice) {
        const diff = Math.abs(fromPrice - toPrice);
        // Get number of decimal places in entry price to determine pip value
        const decimalPlaces = fromPrice.toString().includes('.') ? 
                             fromPrice.toString().split('.')[1].length : 0;
        
        // For prices with 5 decimals like EURUSD (1.12345)
        if (decimalPlaces >= 5 && fromPrice < 10) {
            return diff * 100000; // 1 pip = 0.0001, so multiply by 10000
        }
        // For prices with 4 decimals like some forex
        else if (decimalPlaces >= 4 && fromPrice < 10) {
            return diff * 10000; // 1 pip = 0.0001, so multiply by 10000
        }
        // For prices with 3 decimals like JPY pairs (e.g. 130.123)
        else if (decimalPlaces >= 2 && fromPrice >= 10 && fromPrice < 1000) {
            return diff * 100; // 1 pip = 0.01, so multiply by 100
        }
        // For indices, stocks, etc
        else {
            return diff * 10; // 1 pip = 0.1, so multiply by 10
        }
    }
    
    calculateButton.addEventListener('click', function() {
        const isPipCalculation = byPipBtn.classList.contains('active');
        
        // Validate common inputs
        const commonInputs = [
            { el: entryPriceInput, name: 'Entry Price', min: 0.00001 },
            { el: pipValueInput, name: 'Pip Value', min: 0.01 },
            { el: lotSizeInput, name: 'Lot Size', min: 0.01 }
        ];
        
        if (!validateInputs(commonInputs)) return;
        
        // Get common input values
        const orderType = orderTypeSelect.value;
        const entryPrice = parseFloat(entryPriceInput.value);
        const pipValue = parseFloat(pipValueInput.value);
        const lotSize = parseFloat(lotSizeInput.value);
        
        let slPrice, tpPrice, slPips, tpPips, riskValue, profitValue;
        
        // Calculate based on input type
        if (isPipCalculation) {
            // Validate pip inputs
            if (!validateInputs([
                { el: slPipsInput, name: 'SL Pips', min: 1 },
                { el: tpPipsInput, name: 'TP Pips', min: 1 }
            ])) return;
            
            slPips = parseFloat(slPipsInput.value);
            tpPips = parseFloat(tpPipsInput.value);
            
            // Calculate SL/TP prices
            // Detect pip size from entry price
            const pipSize = detectPipSize(entryPrice);
            
            if (orderType === 'buy') {
                slPrice = entryPrice - (slPips * pipSize);
                tpPrice = entryPrice + (tpPips * pipSize);
            } else { // sell
                slPrice = entryPrice + (slPips * pipSize);
                tpPrice = entryPrice - (tpPips * pipSize);
            }
            
            // Calculate risk and profit values
            riskValue = slPips * pipValue * lotSize;
            profitValue = tpPips * pipValue * lotSize;
            
        } else {
            // Validate money inputs
            if (!validateInputs([
                { el: slMoneyInput, name: 'SL Money', min: 1 },
                { el: tpMoneyInput, name: 'TP Money', min: 1 }
            ])) return;
            
            riskValue = parseFloat(slMoneyInput.value);
            profitValue = parseFloat(tpMoneyInput.value);
            
            // Calculate pips from money
            slPips = riskValue / (pipValue * lotSize);
            tpPips = profitValue / (pipValue * lotSize);
            
            // Detect pip size from entry price
            const pipSize = detectPipSize(entryPrice);
            
            // Calculate SL/TP prices
            if (orderType === 'buy') {
                slPrice = entryPrice - (slPips * pipSize);
                tpPrice = entryPrice + (tpPips * pipSize);
            } else { // sell
                slPrice = entryPrice + (slPips * pipSize);
                tpPrice = entryPrice - (tpPips * pipSize);
            }
        }
        
        // Calculate Risk-Reward Ratio
        const rrRatio = profitValue / riskValue;
        
        // Format prices based on entry price decimal places
        const decimalPlaces = Math.max(5, entryPrice.toString().includes('.') ? 
                            entryPrice.toString().split('.')[1].length : 0);
        
        // Display results
        slResultEl.textContent = slPrice.toFixed(decimalPlaces);
        tpResultEl.textContent = tpPrice.toFixed(decimalPlaces);
        slPipResultEl.textContent = `${slPips.toFixed(1)} pips`;
        tpPipResultEl.textContent = `${tpPips.toFixed(1)} pips`;
        riskValueEl.textContent = `$${riskValue.toFixed(2)}`;
        profitValueEl.textContent = `$${profitValue.toFixed(2)}`;
        rrResultEl.textContent = `1:${rrRatio.toFixed(2)}`;
        
        // Generate advice based on RRR
        let advice = '';
        
        if (rrRatio < 1) {
            advice = 'คำเตือน: Risk-Reward Ratio ต่ำกว่า 1:1 ไม่แนะนำให้เข้าเทรด เนื่องจากความเสี่ยงสูงกว่าผลตอบแทนที่คาดหวัง';
        } else if (rrRatio >= 1 && rrRatio < 2) {
            advice = 'Risk-Reward Ratio ควรจะอยู่ที่อย่างน้อย 1:2 เพื่อให้มีโอกาสที่ดีในการทำกำไรระยะยาว คุณอาจพิจารณาปรับ SL/TP';
        } else if (rrRatio >= 2 && rrRatio < 3) {
            advice = 'Risk-Reward Ratio ที่ 1:' + rrRatio.toFixed(2) + ' ถือว่าดี ทำให้คุณสามารถขาดทุนได้มากกว่าที่ชนะ แต่ยังคงทำกำไรในระยะยาว';
        } else {
            advice = 'Risk-Reward Ratio ที่ 1:' + rrRatio.toFixed(2) + ' ถือว่าดีมาก ทำให้คุณมีโอกาสทำกำไรระยะยาวได้สูง แม้จะมี Win Rate ต่ำกว่า 50%';
        }
        
        adviceEl.textContent = advice;
        
        // Show results
        resultsDiv.classList.remove('hidden');
    });
}

// ============ 5. RRR + WIN RATE CALCULATOR ============
function initRRRWinRateCalculator() {
    const portfolioAmountInput = document.getElementById('rrr-portfolio-amount');
    const rrrInput = document.getElementById('rrr-ratio-input');
    const tradesPerMonthInput = document.getElementById('rrr-trades-per-month');
    const noOfRisksInput = document.getElementById('no-of-risks');
    const calculateButton = document.getElementById('rrr-calculate-button');
    const resultsDiv = document.getElementById('rrr-results');
    
    // Result elements
    const rrrEl = document.getElementById('rrr-ratio');
    const winrateEl = document.getElementById('rrr-winrate');
    const winsNeededEl = document.getElementById('rrr-wins-needed');
    const monthlyProfitEl = document.getElementById('rrr-monthly-profit');
    const winrateTableEl = document.getElementById('rrr-winrate-table');
    const adviceEl = document.getElementById('rrr-advice');
    
    // Set default values
    rrrInput.value = "2";
    tradesPerMonthInput.value = "20";
    
    calculateButton.addEventListener('click', function() {
        // Validate inputs
        const inputFields = [
            { el: portfolioAmountInput, name: 'จำนวนเงินในพอร์ต', min: 1 },
            { el: rrrInput, name: 'Risk-Reward Ratio', min: 0.1 },
            { el: tradesPerMonthInput, name: 'จำนวนเทรดต่อเดือน', min: 1 },
            { el: noOfRisksInput, name: 'จำนวนความเสี่ยง', min: 1 }
        ];
        
        if (!validateInputs(inputFields)) return;
        
        // Get input values
        const portfolioAmount = parseFloat(portfolioAmountInput.value);
        const rrRatio = parseFloat(rrrInput.value);
        const tradesPerMonth = parseInt(tradesPerMonthInput.value);
        const noOfRisks = parseInt(noOfRisksInput.value);
        
        // Calculate minimum win rate needed to break even
        const minWinRate = (1 / (1 + rrRatio)) * 100;
        
        // Calculate wins needed per month to breakeven
        const winsNeededToBreakeven = Math.ceil(minWinRate * tradesPerMonth / 100);
        
        // ใช้ค่าความเสี่ยงเริ่มต้นเป็น 5% ของพอร์ต
        const riskPercent = noOfRisks ; 
        const riskAmount = portfolioAmount * (riskPercent / 100);
        const rewardAmount = riskAmount * rrRatio;
        
        // Calculate expected value of a single trade with given win rate
        function calculateExpectedValue(winRate) {
            const winRateDecimal = winRate / 100;
            return (winRateDecimal * rewardAmount) - ((1 - winRateDecimal) * riskAmount);
        }
        
        // Calculate expected monthly return
        const expectedMonthlyReturn = calculateExpectedValue(minWinRate) * tradesPerMonth;
        
        // Display results
        rrrEl.textContent = `1:${rrRatio.toFixed(2)}`;
        winrateEl.textContent = `${minWinRate.toFixed(2)}%`;
        winsNeededEl.textContent = `${winsNeededToBreakeven} ครั้ง จาก ${tradesPerMonth} เทรด`;

        // Generate win rate table for monthly results
        winrateTableEl.innerHTML = '';

        // สร้าง fullWinRates จากจำนวน win จริง
        const fullWinRates = [];
        for (let wins = 0; wins <= tradesPerMonth; wins++) {
            const rate = Math.ceil((wins / tradesPerMonth) * 100);
            if (!fullWinRates.includes(rate)) {
                fullWinRates.push(rate);
    }
}

        // หา WinRate ที่เป็นจุดสำคัญ
        const importantWinRates = new Set();

        // 1. ค่า WinRate ที่คุ้มทุน
        const rateAtBreakeven = Math.ceil((winsNeededToBreakeven / tradesPerMonth) * 100);
        importantWinRates.add(rateAtBreakeven);

        // 2. ค่า percentile 0, 25, 50, 75, 100
        const percentiles = [0, 25, 50, 75, 100];
        percentiles.forEach(p => {
            const index = Math.floor((p / 100) * (fullWinRates.length - 1));
            importantWinRates.add(fullWinRates[index]);
        });

            // แสดงแถวทั้งหมด แต่ซ่อนแถวที่ไม่สำคัญไว้ก่อน
        let lastWinCount = -1;
        fullWinRates.sort((a, b) => a - b).forEach(winRate => {
            const winsNeeded = Math.floor(winRate * tradesPerMonth / 100);
            if (winsNeeded === lastWinCount) return;
            lastWinCount = winsNeeded;

            const expectedValue = calculateExpectedValue(winRate);
            const monthlyReturn = expectedValue * tradesPerMonth;
            const isProfit = monthlyReturn > 0;

            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${winRate.toFixed(1)}% (${winsNeeded}/${tradesPerMonth} เทรด)</td>
        <td class="${isProfit ? 'profit' : 'loss'}">${isProfit ? '+' : ''}$${monthlyReturn.toFixed(2)}</td>
    `;

            if (!importantWinRates.has(winRate)) {
                row.style.display = 'none';
                row.classList.add('extra-winrate-row');
            }

            winrateTableEl.appendChild(row);
});

        // รีเซต toggle ปุ่มก่อนสร้างใหม่ (หรือก่อนแสดงผลใหม่)
        const existingBtn = document.querySelector('.toggle-winrate-btn');
        if (existingBtn) {
            existingBtn.remove(); // ลบปุ่มเก่า
        }

        // รีเซตสถานะแถวพิเศษให้ซ่อนไว้เสมอ
        document.querySelectorAll('.extra-winrate-row').forEach(row => {
            row.style.display = 'none';
        });

        // สร้างปุ่ม toggle ใหม่
        if (document.querySelectorAll('.extra-winrate-row').length > 0) {
            const toggleBtn = document.createElement('button');
            toggleBtn.textContent = 'ดูทั้งหมด';
            toggleBtn.className = 'toggle-winrate-btn';
            let expanded = false;

            toggleBtn.onclick = () => {
                expanded = !expanded;

                document.querySelectorAll('.extra-winrate-row').forEach(row => {
                    row.style.display = expanded ? '' : 'none';
                });

                toggleBtn.textContent = expanded ? 'ย่อกลับ' : 'ดูทั้งหมด';
            };

            winrateTableEl.parentElement.appendChild(toggleBtn);
        }

        // Generate advice based on RRR
        let advice = '';
        
        if (rrRatio < 1) {
            advice = 'คำเตือน: Risk-Reward Ratio ต่ำกว่า 1:1 ไม่แนะนำให้เข้าเทรด เนื่องจากต้องมี Win Rate สูงมากเพื่อทำกำไรระยะยาว';
        } else if (rrRatio >= 1 && rrRatio < 1.5) {
            advice = 'Risk-Reward Ratio 1:' + rrRatio.toFixed(2) + ' ถือว่าค่อนข้างต่ำ ควรหาเซตอัพที่ให้ RRR อย่างน้อย 1:2 จึงจะทำกำไรระยะยาวได้ดี';
        } else if (rrRatio >= 1.5 && rrRatio < 2) {
            advice = 'Risk-Reward Ratio 1:' + rrRatio.toFixed(2) + ' ถือว่าพอใช้ได้ แต่หากสามารถหาเซตอัพที่ให้ RRR 1:2 หรือมากกว่าได้ จะมีโอกาสทำกำไรได้ดีกว่า';
        } else if (rrRatio >= 2 && rrRatio < 3) {
            advice = 'Risk-Reward Ratio 1:' + rrRatio.toFixed(2) + ' ถือว่าดี คุณสามารถแพ้ได้มากกว่าชนะ แต่ยังคงทำกำไรในระยะยาว';
        } else {
            advice = 'Risk-Reward Ratio 1:' + rrRatio.toFixed(2) + ' ถือว่าดีมาก แม้ Win Rate จะต่ำถึง ' + minWinRate.toFixed(0) + '% คุณก็ยังสามารถทำกำไรในระยะยาวได้';
        }
        
        advice += ` (ใช้ความเสี่ยง ${riskPercent}% ต่อเทรด หรือ $${riskAmount.toFixed(2)} ต่อเทรด)`;
        
        adviceEl.textContent = advice;
        
        // Show results
        resultsDiv.classList.remove('hidden');
    });
}

        // General validation function for inputs
        function validateInputs(inputFields) {
    for (const field of inputFields) {
        const value = parseFloat(field.el.value);
        
        if (isNaN(value) || value === '') {
            alert(`กรุณากรอก ${field.name}`);
            field.el.focus();
            return false;
        }
        
        if (field.min !== undefined && value < field.min) {
            alert(`${field.name} ต้องมีค่าอย่างน้อย ${field.min}`);
            field.el.focus();
            return false;
        }
        
        if (field.max !== undefined && value > field.max) {
            alert(`${field.name} ต้องมีค่าไม่เกิน ${field.max}`);
            field.el.focus();
            return false;
        }
    }
    
    return true;
}

        // Initialize all calculators
        function initCalculators() {
            initLotSizeCalculator();
            initSLTPCalculator();
            // Pip Value Calculator ถูกแทนที่ด้วยวิดเจ็ตจากภายนอกแล้ว
            // Margin Calculator ถูกแทนที่ด้วยวิดเจ็ตจากภายนอกแล้ว
            initRRRWinRateCalculator();
        }
