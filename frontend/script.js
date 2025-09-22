// Fitness data storage
        let fitnessData = [];
        let streakData = {};

        // Create animated stars with enhanced movement
        function createStars() {
            const starsContainer = document.getElementById('stars');
            const numStars = 150;
            
            // Create regular stars
            for (let i = 0; i < numStars; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                
                // Add variety to stars
                if (Math.random() > 0.7) {
                    star.classList.add('bright');
                } else if (Math.random() > 0.5) {
                    star.classList.add('medium');
                }
                
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.width = star.style.height = (Math.random() * 4 + 1) + 'px';
                star.style.animationDelay = Math.random() * 3 + 's';
                star.style.animationDuration = (Math.random() * 3 + 2) + 's, ' + (Math.random() * 10 + 15) + 's';
                
                starsContainer.appendChild(star);
            }

            // Create star clusters
            for (let i = 0; i < 5; i++) {
                const cluster = document.createElement('div');
                cluster.className = 'star-cluster';
                cluster.style.left = Math.random() * 100 + '%';
                cluster.style.top = Math.random() * 100 + '%';
                cluster.style.animationDelay = Math.random() * 25 + 's';
                
                // Add multiple stars to cluster
                for (let j = 0; j < 8; j++) {
                    const clusterStar = document.createElement('div');
                    clusterStar.className = 'star';
                    clusterStar.style.position = 'absolute';
                    clusterStar.style.left = (Math.random() * 40 - 20) + 'px';
                    clusterStar.style.top = (Math.random() * 40 - 20) + 'px';
                    clusterStar.style.width = clusterStar.style.height = (Math.random() * 2 + 1) + 'px';
                    clusterStar.style.animationDelay = Math.random() * 2 + 's';
                    cluster.appendChild(clusterStar);
                }
                
                starsContainer.appendChild(cluster);
            }

            // Create nebula effects
            for (let i = 0; i < 3; i++) {
                const nebula = document.createElement('div');
                nebula.className = 'nebula';
                nebula.style.left = Math.random() * 100 + '%';
                nebula.style.top = Math.random() * 100 + '%';
                nebula.style.width = nebula.style.height = (Math.random() * 200 + 100) + 'px';
                nebula.style.animationDelay = Math.random() * 8 + 's';
                starsContainer.appendChild(nebula);
            }

            // Create constellations (connected stars)
            for (let i = 0; i < 3; i++) {
                const constellation = document.createElement('div');
                constellation.className = 'constellation';
                constellation.style.left = Math.random() * 80 + '%';
                constellation.style.top = Math.random() * 80 + '%';
                constellation.style.animationDelay = Math.random() * 30 + 's';
                
                // Create constellation pattern
                const positions = [
                    {x: 0, y: 0}, {x: 20, y: -10}, {x: 40, y: 5}, 
                    {x: 30, y: 25}, {x: 10, y: 30}
                ];
                
                positions.forEach(pos => {
                    const constellationStar = document.createElement('div');
                    constellationStar.className = 'star bright';
                    constellationStar.style.position = 'absolute';
                    constellationStar.style.left = pos.x + 'px';
                    constellationStar.style.top = pos.y + 'px';
                    constellationStar.style.width = constellationStar.style.height = '3px';
                    constellation.appendChild(constellationStar);
                });
                
                starsContainer.appendChild(constellation);
            }

            // Enhanced shooting stars with random timing
            function createShootingStar() {
                if (Math.random() > 0.3) {
                    const shootingStar = document.createElement('div');
                    shootingStar.className = 'shooting-star';
                    shootingStar.style.left = Math.random() * 100 + '%';
                    shootingStar.style.top = Math.random() * 50 + '%';
                    shootingStar.style.animationDuration = (Math.random() * 2 + 3) + 's';
                    starsContainer.appendChild(shootingStar);
                    
                    setTimeout(() => {
                        if (shootingStar.parentNode) {
                            shootingStar.parentNode.removeChild(shootingStar);
                        }
                    }, 5000);
                }
            }

            // Create shooting stars at random intervals
            setInterval(createShootingStar, 2000);
            
            // Occasionally create bursts of shooting stars
            setInterval(() => {
                if (Math.random() > 0.8) {
                    for (let i = 0; i < 3; i++) {
                        setTimeout(createShootingStar, i * 300);
                    }
                }
            }, 10000);
        }

        // Fitness calculations
        function calculateFitnessScore(steps, weight, height, age) {
            // Calculate stride length (approximate formula)
            const strideLength = (height * 0.45) / 100; // meters
            
            // Calculate distance
            const distance = (steps * strideLength) / 1000; // kilometers
            
            // Calculate baseline calories
            let baselineCalories = steps * 0.04; // Approximate calories per step
            
            // Calculate BMI
            const heightM = height / 100;
            const bmi = weight / (heightM * heightM);
            
            // BMI adjustment factor (normalize around BMI 22)
            let bmiAdjustment = 1;
            if (bmi < 18.5) {
                bmiAdjustment = 0.9; // Underweight - slight penalty
            } else if (bmi > 25) {
                bmiAdjustment = 1.1; // Overweight - slight bonus for effort
            }
            
            // Age adjustment factor (peak performance around 25-30)
            let ageAdjustment = 1;
            if (age < 20) {
                ageAdjustment = 0.95;
            } else if (age > 40) {
                ageAdjustment = 1 + (age - 40) * 0.01; // Bonus for older participants
            }
            
            // Apply adjustments
            const adjustedCalories = baselineCalories * bmiAdjustment * ageAdjustment;
            
            // Convert to points (1 calorie = 2 points)
            let points = Math.round(adjustedCalories * 2);
            
            return {
                distance: distance.toFixed(2),
                calories: Math.round(adjustedCalories),
                points: points,
                bmi: bmi.toFixed(1)
            };
        }

        function addEntry() {
            const name = document.getElementById('name').value;
            const steps = parseInt(document.getElementById('steps').value);
            const weight = parseFloat(document.getElementById('weight').value);
            const height = parseInt(document.getElementById('height').value);
            const age = parseInt(document.getElementById('age').value);
            const team = document.getElementById('team').value;

            // Validation
            if (!name || !steps || !weight || !height || !age) {
                alert('Please fill in all required fields!');
                return;
            }

            if (steps < 0 || weight < 20 || height < 100 || age < 10) {
                alert('Please enter realistic values!');
                return;
            }

            // Show loading
            document.getElementById('loading').style.display = 'block';

            // Simulate processing delay
            setTimeout(() => {
                // Calculate fitness score
                const fitnessScore = calculateFitnessScore(steps, weight, height, age);

                // Update streak data
                const today = new Date().toDateString();
                if (!streakData[name]) {
                    streakData[name] = { streak: 1, lastEntry: today };
                } else {
                    const lastEntry = new Date(streakData[name].lastEntry);
                    const currentEntry = new Date(today);
                    const diffTime = currentEntry - lastEntry;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (diffDays === 1) {
                        streakData[name].streak += 1;
                    } else if (diffDays > 1) {
                        streakData[name].streak = 1;
                    }
                    streakData[name].lastEntry = today;
                }

                // Streak bonus (5% per day, max 50%)
                const streakBonus = Math.min(streakData[name].streak * 0.05, 0.5);
                const streakPoints = Math.round(fitnessScore.points * streakBonus);

                // Team bonus (10% if in a team)
                const teamBonus = team ? Math.round(fitnessScore.points * 0.1) : 0;

                const totalPoints = fitnessScore.points + streakPoints + teamBonus;

                // Find existing user or create new entry
                const existingUserIndex = fitnessData.findIndex(entry => entry.name === name);
                
                if (existingUserIndex >= 0) {
                    // Update existing user
                    const existingEntry = fitnessData[existingUserIndex];
                    existingEntry.totalSteps += steps;
                    existingEntry.totalPoints += totalPoints;
                    existingEntry.entries += 1;
                    existingEntry.avgPoints = Math.round(existingEntry.totalPoints / existingEntry.entries);
                    existingEntry.lastDistance = fitnessScore.distance;
                    existingEntry.lastCalories = fitnessScore.calories;
                    existingEntry.streak = streakData[name].streak;
                    existingEntry.team = team;
                    existingEntry.bmi = fitnessScore.bmi;
                } else {
                    // Add new user
                    fitnessData.push({
                        name: name,
                        totalSteps: steps,
                        totalPoints: totalPoints,
                        entries: 1,
                        avgPoints: totalPoints,
                        lastDistance: fitnessScore.distance,
                        lastCalories: fitnessScore.calories,
                        streak: streakData[name].streak,
                        team: team,
                        bmi: fitnessScore.bmi,
                        age: age
                    });
                }

                // Hide loading and clear form
                document.getElementById('loading').style.display = 'none';
                document.getElementById('name').value = '';
                document.getElementById('steps').value = '';
                document.getElementById('weight').value = '';
                document.getElementById('height').value = '';
                document.getElementById('age').value = '';
                document.getElementById('team').value = '';

                // Update leaderboard
                updateLeaderboard();

                // Success message
                alert(`🎉 Great job, ${name}! You earned ${totalPoints} points!`);
            }, 1500);
        }

        function updateLeaderboard() {
            // Sort by total points
            fitnessData.sort((a, b) => b.totalPoints - a.totalPoints);

            const leaderboardList = document.getElementById('leaderboard-list');
            leaderboardList.innerHTML = '';

            fitnessData.forEach((entry, index) => {
                const rank = index + 1;
                const item = document.createElement('div');
                item.className = 'leaderboard-item';
                item.style.animationDelay = `${index * 0.1}s`;

                const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : '';

                item.innerHTML = `
                    <div class="rank ${rankClass}">${rank}</div>
                    <div class="user-info">
                        <div class="user-name">
                            ${entry.name}
                            ${entry.team ? `<span style="background: linear-gradient(45deg, #667eea, #764ba2); padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; margin-left: 5px;">${entry.team}</span>` : ''}
                            ${entry.streak > 1 ? `<span class="streak-badge">${entry.streak} day streak! 🔥</span>` : ''}
                        </div>
                        <div class="user-stats">
                            <div>👟 ${entry.totalSteps.toLocaleString()} steps</div>
                            <div>📏 ${entry.lastDistance} km</div>
                            <div>🔥 ${entry.lastCalories} cal</div>
                            <div>📊 BMI: ${entry.bmi}</div>
                            <div>📈 ${entry.entries} entries</div>
                            <div>⭐ ${entry.avgPoints} avg pts</div>
                        </div>
                    </div>
                    <div class="points">${entry.totalPoints}</div>
                `;

                leaderboardList.appendChild(item);
            });
        }

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            createStars();
            
            // Add some sample data for demonstration
            const sampleData = [
                { name: "Arpit", steps: 12000, weight: 70, height: 175, age: 22, team: "" },
                { name: "Agrim", steps: 15000, weight: 65, height: 165, age: 24, team: "Beta Warriors" },
                { name: "Abhay Parashar", steps: 8000, weight: 80, height: 180, age: 28, team: "" },
                { name: "Ansh Lohani", steps: 11000, weight: 60, height: 170, age: 21, team: "" }
            ];

            // Auto-populate with sample data
            sampleData.forEach(user => {
                const fitnessScore = calculateFitnessScore(user.steps, user.weight, user.height, user.age);
                streakData[user.name] = { streak: Math.floor(Math.random() * 5) + 1, lastEntry: new Date().toDateString() };
                
                const streakBonus = Math.min(streakData[user.name].streak * 0.05, 0.5);
                const streakPoints = Math.round(fitnessScore.points * streakBonus);
                const teamBonus = user.team ? Math.round(fitnessScore.points * 0.1) : 0;
                const totalPoints = fitnessScore.points + streakPoints + teamBonus;

                fitnessData.push({
                    name: user.name,
                    totalSteps: user.steps,
                    totalPoints: totalPoints,
                    entries: 1,
                    avgPoints: totalPoints,
                    lastDistance: fitnessScore.distance,
                    lastCalories: fitnessScore.calories,
                    streak: streakData[user.name].streak,
                    team: user.team,
                    bmi: fitnessScore.bmi,
                    age: user.age
                });
            });

            updateLeaderboard();
        });

        // Handle Enter key in form
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
                addEntry();
            }
        });