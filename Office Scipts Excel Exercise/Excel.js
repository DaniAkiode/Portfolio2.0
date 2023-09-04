
//Add Projects 
async function addProject(){
    let project = OfficeScript.showInputPrompt("Enter Project Number"); //Enter Project name 
    if (!project) {
      return; //End the function if the inputbox is empty 
    }
    
    let startDate = OfficeScript.showInputPrompt("Enter Project start date"); //enter start date 
    let endDate = OfficeScript.showInputPrompt("Enter Project end date"); //enter end date 

    if (startDate > endDate) { 
        OfficeScript.showNotification("Start Date is after End Date"); //Display message if the start date is later than the end date 
        return;
    }

    let sheet = context.workbook.worksheets.getItem("Master"); //get templet worksheet "Master"
    sheet.load("name"); //Load sheet
    await context.sync(); // synchronise changes made to object workbook

    let startDayOfWeek = startDate.getDay(); // get days of the week (Sunday = 0 , Monday = 1 , Tuesday = 2 etc...)
    let endDayOfWeek = endDate.getDay(); // get days of the week (Sunday = 0 , Monday = 1 , Tuesday = 2 etc...)

    let daysToAddToStart = (7 + 1 - startDayOfWeek) % 7; //Add days to make the the start date a monday
    let daysToAddToEnd = (7 + 1 - endDayOfWeek) % 7; //Add days to make the the end date date a monday

    startDate.setDate(startDate.getDate() + daysToAddToStart);
    endDate.setDate(endDate.getDate() + daysToAddToEnd); 
    
    let newSheet = sheet.copy("before", "Sheet3", {name: project }); //dublicate sheet to Sheet3 on excel and name it the vaiable in 
    let startCell = newSheet.getRange("C1"); //initiate cell on C1(3,1) on excel spreadsheet
    startCell.values = [[startDate]]; // set value in startCell variable to the start date as two-dimentional array 
    let weekDate = new Date(startDate) // set variable weekDate to the start date 

    

    while (weekDate.getTime() !== endDate.getTime()){ //While the week date is not eqaul to the end date 
        weekDate.setDate(weekDate.getDate() + 7); //add 7 days to the value in weekDate to move the weekdate forward by 1 week 
        let newColumn = newSheet.getRange(1, startCell.colomnIndex + 1); // set new column to the range of the first row and add 1 for each repetition.
        newColumn.values = [[weekDate]]; // Set values in new collumn to weekdate 
        startCell = newColumn.getCell(0, 0); //update to tip cell for next iteration
    }


    let projectListSheet = context.workbook.worksheets.getItem("Project List"); //Get the Project List spreadsheet 
    let projectsCountCell = projectListSheet.getRange("D2"); //List Projects from cell D1
    projectsCountCell.values = [[projectsCountCell.values[0][0] + 1]]; //Increment count cell value by one and update cell to keep track with the number of projects 

    let newRow = projectListSheet.getRange("A1").getOffsetRange(projectsCountCell.values[0][0] + 1, 0, 1, 3); //Create a new range on A1 and create and offset range with preciously updated D2 + 1 rows down. this range is 1 row by 3 columns from cell A1 to the right.  
    newRow.values = [[project, startDate, endDate]];  // Set the values of the variables project StartDate and endDate
}

function removeProject(){
    let project = OfficeScript.showInputPrompt ("Enter Project Number to be deleted"); //set project to user input for the project number to be deleted 
    if (!project) {
        return; // end function if input box is empty 
    }

    let projectSheet = context.workbook.worksheets.getItemOrNullObject(project); //Find the project number on the work sheet 
    if (project) {
        projectSheet.delete(); //Delete if the project is available 
    }
    
    //Update list of project on Project List spreadsheet
    let projectListSheet = context.workbook.worksheets.getItem("Project List"); //Set vairable projectListSheet to get the Project List work sheet
    let projectsCountCell = projectListSheet.getRange("D2"); // Get the number of project in cell D2
    projectsCountCell.values = [[projectsCountCell.values[0][0] - 1]]; // subtract value by 1 

    let numRows = projectListSheet.getUsedRange().getRowCount(); // Set numRows to get the row count to store the number of rows in the sheet. 
    for (let i = 0; i < numRows; i++) { //Iterate through the number of rows 
        let currentProject = projectListSheet.getRange("A" + (i + 2)).values[0][0]; //set currentProject to fetch the value of column "A" of the current row. Uses (i + 2) since Excel uses 1-based indexing 
        if (currentProject === project) { // if the project is found then delete the column 
            projectListSheet.getRange("A" + (i + 2) + ":C" + (i + 2)).delete("Up");
            break;//break loop
        }
    }
}



async function UpdateTotals() {
    let projectListSheet = context.workbook.worksheets.getActiveWorksheet(); // Set projectListSheet to Active WorkSheet
    let totalsSheet = context.workbook.worksheets.getActiveWorksheet(); // Set totalSheet to Active WorkSheet
    
    let NoOfProjects = projectListSheet.getRange("D2").load(); //set Number of projects to cell D2 
    let StartDate = projectListSheet.getRange("B4").load(); // Set StartDate to cell B4
    let EndDate = projectListSheet.getRange("C4").load(); // Set EndDate tocell C4

    await context.sync(); //Synchronizes with workbook to ensure loaded data is available 
    
    for (let i = 4; i <= NoOfProjects.value; i++) { //Iterates from row 4 to value of NoOfProjects
        let weekDate = projectListSheet.getRange(i, 2).load(); // Set weekDate to the cell in the ith row and the 2 column of the Project List 
        if (weekDate.value < StartDate.value) { //Check if the value of weekDate is lower then startdate 
            StartDate = weekDate; // if so equate StartDate to WeekDate
        }
        weekDate = projectListSheet.getRange(i, 3).load(); //Set WorkDate value to the cell in the ith row and the 3rd column.   
        if (weekDate.value > EndDate.value) { // Check if the week date is Later than the end date  
            EndDate = weekDate; // Set end Date to Week Date
        }
    }

    let masterSheet = context.workbook.worksheets.getActiveWorksheet(); // Assumes Master is active
    let i = 3; // Set counter "i" to 3 
    while (!masterSheet.getRange(i, 1).isEmpty) { // Itereates while range in Master Sheet is empty 
        i++; // Incrementes by 1 
    }
    let NoOfPersons = i - 3; // Calculate the number of persons by subtracting 3 from the value of i  

    let nweeks = Math.floor((EndDate.value - StartDate.value) / 7) + 1; //calculates the number of weeks between the start date and the end date  
    let weekDate = new Date(StartDate.value); //Create new Date object with the value of StartDate variable
    weekDate.setDate(weekDate.getDate() - 7); //Subtract date by 7 

    for (let I = 3; I <= nweeks + 2; I++) { //Begin iterating from 3 to the value of nweek + 2
        weekDate.setDate(weekDate.getDate() + 7); //Increments the weekDate by 7 days to move to next week  
        totalsSheet.getRange("C1").copyFrom(totalsSheet.getRange("C1"), ExcelScript.CoercionType.values); //Copy values from cell C1 to the same cell to preseve templete 
        let weekColumn = totalsSheet.getRange(1, I); //Assign variable weekColumn to the cell in the 1st row and the ith column in Totals worksheet 
        weekColumn.values = [[weekDate]]; // set value in weekDate to be selected in the Totals worksheet to repeoresent the date for the current week. 
    }

    for (let J = 0; J < NoOfPersons; J++) { // Iterates through each person
        let person = totalsSheet.getRange(J + 3, 2).load(); // //load data from cell located in the row indexed by J + 3 and colelumn 2.
        let hours = 0; // initialise hours to 0 
        
        for (let k = 2; k <= NoOfProjects.value + 1; k++) { // iterates through th enumber of projects with K starting with 2 
            let projectListSheet = context.workbook.worksheets.getActiveWorksheet(); // Assumes Project List is active
            let projectDataRange = projectListSheet.getRange(k, 1, 1, 3).load(); // Assumes project data is in columns A, B, C
            
            await context.sync(); //synchronises changes to ensure the data is available for use 
            
            let Project = projectDataRange.values[0][0]; // Project number
            let projectStartDate = projectDataRange.values[0][1]; // Start date of the project
            let projectEndDate = projectDataRange.values[0][2]; // End date of the project
            
            let hoursForThisProject = calculateHoursForProject(Project, projectStartDate, projectEndDate); 
            
            hours += hoursForThisProject;
        }
        
        await context.sync(); //synchronises changes
        
        totalsSheet.getRange(J + 3, I).values = [[hours]]; //Updates totals worksheet with the accumulated hours value for the current person. assign hours to the cell located in the row indexed by 'J+3' and column indexed by I 
    }
    
    let I = nweeks + 3; //set i to nweeks + 3 
    while (!totalsSheet.getRange(1, I).isEmpty) { // loop through column while the totalsheet is not empty 
        totalsSheet.getRange(1, I).delete(ExcelScript.DeleteShiftDirection.left); // deletes the column specified by the cell in the first row and column I in the "Totals" worksheet.  The DeleteShiftDirection.left argument indicates that the columns should shift to the left after deletion.
    }
}

async function AddPerson(){
     // Declare variables to store data
    let Hours; 
    let Person;
    let Project;
    let StartDate;
    let EndDate;
    let NoOfProjects;

    Person = prompt("Enter Person's Name"); // Prompt the user for the person's name
    if (Person === null || Person ===""){  // Check if the input is empty or canceled, and return if so
        return;
    }

    Hours = parseFloat(prompt("Enter Persons's contract hours"));  // Prompt the user for the person's contract hours
    if (isNan(Hours)){// Check if the input is not a valid number, and return if so
        return;
    }

    let masterSheet = context.workbook.worksheets.getActiveWorksheet(); /// Fetch the active worksheet and store it as 'masterSheet'

    let i = 3; // Initialize a counter for finding the next available row in 'masterSheet'
    while (!masterSheet.getRange(i, 1).isEmpty) {  // Iterate through rows until an empty cell is found
        i++; //increment i
    }

    masterSheet.getRange(i - 1,1).copyFrom(masterSheet.getRange(i - 1, 1), ExcelScript.CoercionType.values); // Copy the formatting from the previous row 
    masterSheet.getRange(i, 1).values = [[Person]]; //set the value in the first column to 'Person'

    let projectListSheet = context.workbook.worksheets.getActiveWorksheet(); // Fetch the active worksheet and store it as 'projectListSheet'
    NoOfProjects = projectListSheet.getRange("D2").values[0][0]; // Load the value from cell "D2" to get the number of projects

    for (let k = 2; k <= NoOfProjects + 1; k++) {  // Loop through projects to add the new person's information
        // Load project data (columns A, B, and C) for the current project
        let projectDataRange = projectListSheet.getRange(k, 1, 1, 3);
        let projectData = projectDataRange.load();

        await context.sync(); // Synchronize changes with Excel

         // Extract project details from loaded data
        Project = projectData.values[0][0];
        StartDate = project.values[0][1];
        EndDate = projectData.values[0][2];

        let nweeks = Math.floor((EndDate - StartDate) / 7) + 1; // Calculate the number of weeks between start and end dates

        let projectSheet = context.workbook.worksheets.getItem(Project); // Fetch the project worksheet by its name
        let i = 3; // Find the next available row in the project sheet
        while (!projectSheet.getRange(i, 1).isEmpty) {
            i++;
        }

         // Copy formatting and set the person's name in the project sheet
        projectSheet.getRange(i - 1, 1).copyFrom(projectSheet.getRange(i - 1, 1), ExcelScript.CoercionType.values);
        projectSheet.getRange(i, 1).values = [[Person]];

        // Clear cells in columns 3 to 'nweeks + 2' for the new person's entry in the project sheet
        for (let J = 3; J <= nweeks + 2; J++) {
            projectSheet.getRange(i, J).clear();
        }
        
    }

    let totalsSheet = context.workbook.worksheets.getActiveWorkSheet();  // Fetch the active worksheet and store it as 'totalsSheet'

    // Find the next available row on 'totalsSheet'
    i = 3;
    while (!totalSheet.getRange(i, 1).isEmpty) {
        i++;
    }

    // Copy formatting and set the values for 'Hours' and 'Person' columns in 'totalsSheet'
    totalsSheet.getRange(i - 1,1).copyFrom(totalsSheet.getRange(i - 1,1), ExcelScript.CoercionType.values); 
    totalSheet.getRange(i, 1).values = [[Hours]];
    totalSheet.getRange(i, 2).values = [[Person]];

    // Increment 'i' and find the next available row on 'totalsSheet'
    i = i + 3;
    while (!totalsSheet.getRange(i, 1).isEmpty) {
        i++;
    }


    totalsSheet.getRange(i - 1, 1).copyFrom(totalsSheet.getRange(i - 1, 1), ExcelScript.CoercionType.formulasAndNumberFormats);  // Copy formatting and apply formulas and number formats on 'totalsSheet'
}

async function RemovePerson(){
     // Declare variables to store data
    let Person; 
    let FirstPerson = this.getFirstPerson(); //Set FirstPerson to function that looks for the first person
    let Project;
    let NoOfProjects;

    // Prompt the user for the person's name to be deleted
    Person = prompt("Enter Person to be deleted");
    if (Person === null || Person === "") {  // Check if the input is empty or canceled, and return if so
        return;
    }

    // Fetch the active worksheet and store it as 'masterSheet'
    let masterSheet = context.workbook.worksheets.getActiveWorksheet();

     // Initialize a counter for finding the row of the person to be deleted in 'masterSheet'
    let i = 3;
    while (masterSheet.getRange(i, 1).values[0][0] !== Person) {
        i++;
        // Check if the end of the sheet is reached, and return if so
        if (masterSheet.getRange(i, 1).isEmpty){
            return;
        }
    }

     // Delete the row containing the person's name from 'masterSheet'
    masterSheet.getRange(i, 1).delete(ExcelScript.DeleteShiftDirection.up);

     // Fetch the active worksheet and store it as 'projectListSheet'
    let projectListSheet = context.workbook.worksheets.getActiveWorksheet();
    // Load the value from cell "D2" to get the number of projects
    NoOfProjects = projectListSheet.getRange("D2").values[0][0];

    // Loop through projects to remove the person's information
    for (let k = 2; k <= NoOfProjects + 1; k++) {
        // Load project data (column A) for the current project
        let projectDataRange = projectListSheet.getRange(k, 1, 1, 1);
        let projectData = projectDataRange.load();

        // Synchronize changes with Excel
        await context.sync();
        // Extract project details from loaded data
        Project = projectData.values[0][0];
        // Fetch the project worksheet by its name
        let projectSheet = context.workbook.worksheets.getItem(Project)

        // Initialize a counter for finding the row of the person to be deleted in the project sheet
        i = 3;
        // Iterate through rows until the person's name is found
        while (projectSheet.getRange(i, 1).values[0][0] !== Person){
            i++;
            // Check if the end of the sheet is reached, and break if so
            if (projectSheet.getRange(i, 1).isEmpty){
                break;
            }
        }

        // Delete the row containing the person's name from the project sheet if it's not empty
        if (!projectSheet.getRange(i, 1).isEmpty) {
            projectSheet.getRange(i, 1.).delete(ExcelScript.DeleteShiftDirection.up);
        }
    }

    // Fetch the active worksheet and store it as 'totalsSheet'
    let totalsSheet = context.workbook.worksheets.getActiveWorksheet();

    // Initialize a counter for finding the row of the person's name to be deleted on 'totalsSheet'
    i = 3;
    // Load the value from cell (i, 2) to get the first person's name
    FirstPerson = totalsSheet.getRange(i, 2).values[0][0];

    // Iterate through rows until the person's name is found
    while (totalsSheet.getRange(i, 2).values[0][0] !== Person) {
        i++;
        // Check if the end of the sheet is reached, and return if so
        if (totalsSheet.getRange(i, 1).isEmpty) {
            return;
        }
    }

    // Delete the row containing the person's name from 'totalsSheet'
    totalsSheet.getRange(i, 1).delete(excelScript.DeleteShiftDirection.up);
    let N = i -3;
    
    // Iterate through rows until the first person's name is found
    while (totalsSheet.getRange(i, 2).values[0][0] !== FirstPerson) {
        i++;
    }

    // Delete the row containing the person's hours and data below the deleted person's entry
    totalsSheet.getRange(N + 1, 1).delete(ExcelScript.DeleteShiftDirection.up);

}



