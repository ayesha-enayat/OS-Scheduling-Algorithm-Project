const prompt = require('prompt-sync')(); // Require the prompt-sync module for user input

// Function to take input for execution time of each process
function getProcessInfo(numberOfProcesses) {
    let processInfoArray = [];
    for (let i = 0; i < numberOfProcesses; i++) {
        let executionTime = parseInt(prompt(`Enter execution time for process ${i + 1} (1-10): `));

        while (isNaN(executionTime) || executionTime < 1 || executionTime > 10) {
            console.log("Invalid input. Execution time must be a number between 1 and 10.");
            executionTime = parseInt(prompt(`Enter execution time for process ${i + 1} (1-10): `));
        }

        processInfoArray.push({
            processID: `P${i + 1}`,
            executionTime: executionTime,
            arrivalTime: i,  // Set arrival time based on process index
            remainingTime: executionTime,
            startTime: -1,
            finishTime: -1,
            waitTime: 0,
            turnAroundTime: 0,
            utilization: 0  // Initialize utilization
        });
    }
    return processInfoArray;
}

// Function to apply Shortest Remaining Time (SRT) scheduling
function shortestRemainingTime(processInfoArray) {
    let currentTime = 0;
    let completedProcesses = 0;
    let n = processInfoArray.length;
    let executionOrder = [];  // Array to store process execution order

    // Loop until all processes are completed
    while (completedProcesses < n) {
        // Find the process with the shortest remaining time that has arrived
        let shortestProcess = null;
        for (let process of processInfoArray) {
            if (process.arrivalTime <= currentTime && process.remainingTime > 0) {
                if (shortestProcess === null || process.remainingTime < shortestProcess.remainingTime) {
                    shortestProcess = process;
                }
            }
        }

        // If there's no process ready, increment time
        if (shortestProcess === null) {
            currentTime++;
            continue;
        }

        // Set the start time for the selected process if it hasn't started
        if (shortestProcess.startTime === -1) {
            shortestProcess.startTime = currentTime;
        }

        // Execute the process for one unit of time
        executionOrder.push(shortestProcess.processID);
        shortestProcess.remainingTime -= 1;
        currentTime++;

        // If the process is completed
        if (shortestProcess.remainingTime === 0) {
            shortestProcess.finishTime = currentTime;
            shortestProcess.turnAroundTime = shortestProcess.finishTime - shortestProcess.arrivalTime;
            shortestProcess.waitTime = shortestProcess.turnAroundTime - shortestProcess.executionTime;
            completedProcesses++;
        }
    }

    // Print execution order in one line
    console.log("\nProcess Execution Order (SRT): " + executionOrder.join(" "));
}

// Calculate and print utilization
function calculateUtilization(processInfoArray) {
    // Find total CPU active time
    let firstStartTime = Math.min(...processInfoArray.map(p => p.startTime));
    let lastFinishTime = Math.max(...processInfoArray.map(p => p.finishTime));
    let totalCpuActiveTime = lastFinishTime - firstStartTime;

    // Calculate utilization for each process
    processInfoArray.forEach(process => {
        process.utilization = (process.executionTime / totalCpuActiveTime) * 100;
    });
}

// Main code execution
(function main() {
    // Input number of processes
    let numberOfProcesses = parseInt(prompt("Enter number of processes (1-5): "));

    while (isNaN(numberOfProcesses) || numberOfProcesses < 1 || numberOfProcesses > 5) {
        console.log("Invalid input. Number of processes must be between 1 and 5.");
        numberOfProcesses = parseInt(prompt("Enter number of processes (1-5): "));
    }

    // Get process information from the user
    let processInfoArray = getProcessInfo(numberOfProcesses);

    // Apply SRT scheduling
    shortestRemainingTime(processInfoArray);

    // Calculate utilization for each process
    calculateUtilization(processInfoArray);

    // Print final process information
    console.log("\n========================================");
    console.log("Final Process Information:");
    console.log("---------------------------------------------------------------------");
    console.log("Process\tArrival\tStart\tWait\tFinish\tTurnaround\tUtilization (%)");
    console.log("ID\tTime\tTime\tTime\tTime\tTime\t\t");
    console.log("---------------------------------------------------------------------");

    processInfoArray.forEach(processInfo => {
        console.log(`${processInfo.processID}\t${processInfo.arrivalTime}\t${processInfo.startTime}\t${processInfo.waitTime}\t${processInfo.finishTime}\t${processInfo.turnAroundTime}\t\t${processInfo.utilization.toFixed(2)}%`);
    });
})();
