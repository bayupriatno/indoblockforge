// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleVoting is Ownable {
    struct Proposal {
        string description;
        uint256 voteCount;
        mapping(address => bool) voted;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public nextProposalId;
    address[] public whitelistedVoters;

    event ProposalCreated(uint256 proposalId, string description);
    event Voted(uint256 proposalId, address voter);

    constructor(address[] memory _whitelistedVoters) Ownable(msg.sender) {
        whitelistedVoters = _whitelistedVoters;
    }

    function createProposal(string memory description) public onlyOwner {
        proposals[nextProposalId].description = description;
        proposals[nextProposalId].voteCount = 0;
        emit ProposalCreated(nextProposalId, description);
        nextProposalId++;
    }

    function vote(uint256 proposalId) public {
        require(isWhitelisted(msg.sender), "Not a whitelisted voter");
        require(!proposals[proposalId].voted[msg.sender], "You have already voted");

        proposals[proposalId].voted[msg.sender] = true;
        proposals[proposalId].voteCount++;
        emit Voted(proposalId, msg.sender);
    }

    function isWhitelisted(address voter) private view returns (bool) {
        for (uint256 i = 0; i < whitelistedVoters.length; i++) {
            if (whitelistedVoters[i] == voter) {
                return true;
            }
        }
        return false;
    }
}
