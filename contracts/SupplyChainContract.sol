pragma solidity >= 0.4.0 < 0.7.0;
pragma experimental ABIEncoderV2;

contract SupplyChainContract{
    
    struct item{
        string name;
        uint trackingId;
        uint price;
        address owner;
        status currentStatus;
    }
    
    enum status {Farmer, Distributor, Retailer, Customer}
    
    mapping(uint => item) public items;
    
    uint public itemCounter;
    
    constructor() public{
        itemCounter = 0;
    }
    
    modifier onlyOwner(uint _trackingId){
        require(msg.sender == items[_trackingId-1].owner, "Only owner can call this method");
        _;
    }
    
    modifier validStatus(uint _status, uint _trackingId){
        require(_status > uint(items[_trackingId-1].currentStatus) && _status < 4, "Require Invalid Status");
        _;
    }
    
    modifier isSold(uint _status){
        require(_status <= 4, "Item is sold or Invalid status");
        _;
    }

    modifier onlyNewOwner(address _newOwner){
        require(msg.sender == _newOwner, "Only New Owner Can Invoke This Function");
        _;
    }
    
    function addItem(string memory _name, uint _price) public returns(item memory){
        
        items[itemCounter].name = _name;
        items[itemCounter].trackingId = itemCounter + 1;
        items[itemCounter].owner = msg.sender;
        items[itemCounter].currentStatus = status.Farmer;
        items[itemCounter].price = _price;
        itemCounter++;
        return items[itemCounter];
    }
    
    function transferOwnership(address _newOwner, uint _trackingId, status _s) public onlyNewOwner(_newOwner) validStatus(uint(_s), _trackingId) isSold(uint(_s)) returns(item memory){ 
        
        _trackingId--;
        items[_trackingId].owner = _newOwner;
        items[_trackingId].currentStatus = _s;
        
        return items[_trackingId];
    }
    
    function editPrice(uint _trackingId, uint _price) public onlyOwner(_trackingId) isSold (_trackingId) isSold(uint(items[_trackingId].currentStatus)) {
        
        items[_trackingId - 1].price = _price;
    }
    
}