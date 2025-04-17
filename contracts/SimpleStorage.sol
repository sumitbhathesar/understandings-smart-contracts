pragma solidity ^0.8.0;

contract SimpleStorage {
    // Store multiple numbers
    uint[] public storedValues;

    // Set multiple values
    function set(uint _value) public {
        storedValues.push(_value); // Add the new value to the array
    }

    // Get all stored values
    function getAll() public view returns (uint[] memory) {
        return storedValues;
    }

    // Get the latest stored value
    function get() public view returns (uint) {
        require(storedValues.length > 0, "No values stored.");
        return storedValues[storedValues.length - 1];
    }
}