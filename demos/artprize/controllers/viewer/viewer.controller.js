/*globals location, app, io, Blockforge*/
/*eslint no-console: ["error", { allow: ["info", "error"] }]*/
app.controller(`blockforgeViewer`, [`$scope`, `constants`, function($scope){
  $scope.status      = `Waiting for data...`;
  $scope.robotStatus = `Waiting for data...`;
  $scope.viewers     = `Waiting for data...`;
  $scope.goodbye     = `Thank you, we hope you had fun!`;

  // Blocks
  // ------
  $scope.blocks = [];

  // Plane
  // -----
  $scope.planes = [{
    position: `0 0 0`,
    rotation: `-90 0 0`,
    width   : `100`,
    height  : `100`,
    color   : `#222`
  }];

  // Sky
  // ---
  $scope.sky = {
    color: `#222`
  };

  // Blockforge Settings
  // -------------------
  const blockforgeSettings = {
    name  : `Art Prize`,
    socket: io.connect(`${location.origin}/receive`)
  };

  // Blockforge
  // ----------
  const blockforge = new Blockforge(blockforgeSettings);

  // Listen for viewers
  // ------------------
  blockforge.on(`viewers`, (count) => {
    $scope.viewers = `There ${count > 1? `are`: `is`} ${count} ${count > 1? `people`: `person`} here right now.`;
  });

  // Listen for detected blocks
  // --------------------------
  blockforge.on(`blocks`, (data) => {
    // Total blocks
    // ------------
    let totalBlocks = 0;

    // Clear previous values
    // ---------------------
    $scope.blocks     = [];

    // Compare two values to see if they are equal
    // -------------------------------------------
    const isEqual = (name, compare) => name === compare;

    // A place to store lines
    // ----------------------
    const redSquareLines    = [];
    const blueSquareLines   = [];
    const yellowSquareLines = [];

    // Find lines
    // ----------
    data.forEach((lines) => {
      totalBlocks += lines.length;

      lines.forEach((block, index) => {
        if((index === 0) && isEqual(`red-square-block`, block))  redSquareLines.push(lines);
        if((index === 0) && isEqual(`blue-square-block`, block)) blueSquareLines.push(lines);
        if((index === 0) && isEqual(`yellow-square-block`, block)) yellowSquareLines.push(lines);
      });
    });

    // Update VR blocks
    // ----------------
    redSquareLines.forEach((line, index) => {
      $scope.blocks.push({
        position: `${index} 0.5 -3`,
        rotation: `0 0 0`,
        color   : `#FF3333`
      });
    });

    blueSquareLines.forEach((line, index) => {
      $scope.blocks.push({
        position: `${index} 1.25 -3`,
        rotation: `0 0 0`,
        color   : `#0033ff`
      });
    });

    yellowSquareLines.forEach((line, index) => {
      $scope.blocks.push({
        position: `-${index + 1} 0.5 -3`,
        rotation: `0 0 0`,
        color   : `#ffaa33`
      });
    });

    // Update the status messages
    // --------------------------
    $scope.status      = `detected ${data.length} lines, ${totalBlocks} blocks`;
    $scope.robotStatus = `created ${data.length} robots`;

    // Update the scope
    // ----------------
    $scope.$apply();
  });
}]);