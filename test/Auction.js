const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
use(solidity);

describe("DeX-Auction test", function () {
  let Token1;
  let Token2;
  let AssetContract;
  let AuctionContract;
  let owner;
  let seller;
  let bidders;
  let CEO;
  let CFO;

  beforeEach(async function () {
    Token1 = await ethers.getContractFactory("DeXAuction");
    [owner, seller, CEO, CFO, ...bidders] = await ethers.getSigners();
    AssetContract = await Token1.deploy();
    await AssetContract.deployed();
    Token2 = await ethers.getContractFactory("AuctionBase");
    AuctionContract = await Token2.deploy(AssetContract.address);
    await AuctionContract.deployed();
    await AssetContract.SetAuctionAddress(AuctionContract.address);
  });
  describe("Deployment", function () {
    it("Deploys", async function () {
      const address1 = AssetContract.address;
      const address2 = AuctionContract.address;
      expect(address1 != 0x0);
      expect(address1 != "");
      expect(address1 != null);
      expect(address1 != undefined);
      expect(address2 != 0x0);
      expect(address2 != "");
      expect(address2 != null);
      expect(address2 != undefined);
    });
  });
  describe("Asset", function () {
    describe("Mint", function () {
      it("Mints", async function () {
        expect(await AssetContract.Mint("IronMan"))
          .to.emit(AssetContract, "Minted")
          .withArgs(owner.address, 1);
        expect(await AssetContract.connect(seller).Mint("Thor"))
          .to.emit(AssetContract, "Minted")
          .withArgs(seller.address, 2);
      });
      it("Can Access Owner/All Assets", async function () {
        await AssetContract.Mint("IronMan");
        await AssetContract.Mint("CaptainAmerica");
        await AssetContract.Mint("BlackWidow");
        await AssetContract.connect(seller).Mint("HawkEye");
        await AssetContract.connect(seller).Mint("BlackPanther");
        await AssetContract.connect(seller).Mint("Hulk");
        // assets = await AssetContract.getAllAssets();
        // assets = await Promise.all(assets.map(async i => {
        //   const tokenURI = await AssetContract.tokenURI(i.TokenID);
        //   let asset = {
        //     tokenId: i.TokenID.toString(),
        //     owner: i.owner,
        //     tokenURI
        //   }
        //   return asset;
        // }))
        // console.log("Assets: ",assets);

        // console.log(await AssetContract.getOwnerAssets());
        // console.log(await AssetContract.connect(seller).getOwnerAssets());
        // console.log(await AssetContract.getAllAssets());
      });
    });
    describe("Burn", function () {
      it("Burns", async function () {
        await AssetContract.Mint("IronMan");
        await AssetContract.Mint("CaptainAmerica");
        await AssetContract.Mint("BlackWidow");
        await AssetContract.connect(seller).Mint("HawkEye");
        await AssetContract.connect(seller).Mint("BlackPanther");
        await AssetContract.connect(seller).Mint("Hulk");
        expect(await AssetContract.Burn(2))
          .to.emit(AssetContract, "Burned")
          .withArgs(owner.address, 2);
        expect(await AssetContract.connect(seller).Burn(6))
          .to.emit(AssetContract, "Burned")
          .withArgs(seller.address, 6);
        assets = await AssetContract.getAllAssets();
        assets = await Promise.all(assets.filter(i => {
          if(i.TokenID.toString() == 0){return false;}
          return true;
        }).map(async i => {
          const tokenURI = await AssetContract.tokenURI(i.TokenID);
          let asset = {
            tokenId: i.TokenID.toString(),
            owner: i.owner,
            tokenURI
          }
          return asset;
        })).then(console.log("Creation Successfull"));
          // console.log("Assets: ",assets);
        // console.log(await AssetContract.getOwnerAssets());
        // console.log(await AssetContract.connect(seller).getOwnerAssets());
        // console.log(await AssetContract.getAllAssets());
      });
      it("Should not burn non-existent NFT", async function () {
        await expect(AssetContract.connect(seller).Burn(5)).to.be.revertedWith(
          "ERC721: Owner query for non-existent token"
        );
      });
      it("Should not burn other's NFT", async function () {
        await AssetContract.Mint("IronMan");
        await expect(AssetContract.connect(seller).Burn(1)).to.be.revertedWith(
          "NFT query for not owned NFT"
        );
      });
      it("Should not burn NFT which is on auction", async function () {
        await AssetContract.connect(seller).Mint("IronMan");
        await AssetContract.connect(seller).Approve(1);
        await AuctionContract.connect(seller).CreateAuction(1, ethers.utils.parseEther('0.5'), 7200);
        await expect(AssetContract.connect(seller).Burn(1))
        .to.be.revertedWith('Burn failed NFT on Auction');
      });
    });
  });
  describe("Auction", function () {
    describe("Create", function () {
      it("Creates Auction", async function () {
        await AssetContract.connect(seller).Mint("IronMan");
        await AssetContract.connect(seller).Approve(1);
        expect(
          await AuctionContract.connect(seller).CreateAuction(
            1,
            ethers.utils.parseEther("0.5"),
            7200
          )
        )
          .to.emit(AuctionContract, "AuctionCreated")
          .withArgs(1, ethers.utils.parseEther("0.5"), 7200);
        // const count= await AuctionContract.connect(seller).auctionBalance(seller.address);
        // console.log(count.toNumber());
      });
      it("Only seller should be able to create Auction", async function () {
        await AssetContract.connect(seller).Mint("IronMan");
        await AssetContract.connect(seller).Approve(1);
        await expect(
          AuctionContract.connect(bidders[3]).CreateAuction(
            1,
            ethers.utils.parseEther("0.5"),
            7200
          )
        ).to.be.revertedWith("NFT query for not owned NFT");
      });
      it("Should not create Auction if NFT not approved", async function () {
        await AssetContract.connect(seller).Mint("IronMan");
        await expect(
          AuctionContract.connect(seller).CreateAuction(
            1,
            ethers.utils.parseEther("0.5"),
            7200
          )
        ).to.be.revertedWith("NFT not approved for auction");
      });
      it("Should not create Auction when duration is 0 min", async function () {
        await AssetContract.connect(seller).Mint("IronMan");
        await AssetContract.connect(seller).Approve(1);
        await expect(
          AuctionContract.connect(seller).CreateAuction(
            1,
            ethers.utils.parseEther("0.0"),
            0
          )
        ).to.be.revertedWith("Duration must be equal or greater than 1 hours");
      });
      it("Should not re-create existing Auction", async function () {
        await AssetContract.connect(seller).Mint("IronMan");
        await AssetContract.connect(seller).Approve(1);
        await AuctionContract.connect(seller).CreateAuction(
          1,
          ethers.utils.parseEther("0.5"),
          7200
        );
        await expect(
          AuctionContract.connect(bidders[0]).CreateAuction(
            1,
            ethers.utils.parseEther("0.5"),
            7200
          )
        ).to.be.revertedWith("Auction already exists");
        await expect(
          AuctionContract.connect(seller).CreateAuction(
            1,
            ethers.utils.parseEther("0.5"),
            7200
          )
        ).to.be.revertedWith("Auction already exists");
      });
    });
    describe("Bid", function () {
      it("Accepts Bid", async function () {
        await AssetContract.connect(seller).Mint("IronMan");
        await AssetContract.connect(seller).Approve(1);
        await AuctionContract.connect(seller).CreateAuction(
          1,
          ethers.utils.parseEther("0.5"),
          7200
        );
        await expect(
          AuctionContract.connect(bidders[0]).BidAuction(1, {
            value: ethers.utils.parseEther("5.0"),
          })
        )
          .to.emit(AuctionContract, "BidPlaced")
          .withArgs(1, bidders[0].address, ethers.utils.parseEther("5.0"));
      });
      it("Accepts Max Bid", async function () {
        await AssetContract.connect(seller).Mint("IronMan");
        await AssetContract.connect(seller).Approve(1);
        await AuctionContract.connect(seller).CreateAuction(
          1,
          ethers.utils.parseEther("0.5"),
          7200
        );
        await expect(
          AuctionContract.connect(bidders[0]).BidAuction(1, {
            value: ethers.utils.parseEther("5.0"),
          })
        )
          .to.emit(AuctionContract, "BidPlaced")
          .withArgs(1, bidders[0].address, ethers.utils.parseEther("5.0"));
        await expect(
          AuctionContract.connect(bidders[1]).BidAuction(1, {
            value: ethers.utils.parseEther("10.0"),
          })
        )
          .to.emit(AuctionContract, "BidPlaced")
          .withArgs(1, bidders[1].address, ethers.utils.parseEther("10.0"));
      });
      it("Refunds Prev Bidder Bid", async function () {
        await AssetContract.connect(seller).Mint("IronMan");
        await AssetContract.connect(seller).Approve(1);
        await AuctionContract.connect(seller).CreateAuction(
          1,
          ethers.utils.parseUnits("1.0", "gwei"),
          7200
        );
        await expect(
          await AuctionContract.connect(bidders[0]).BidAuction(1, {
            value: ethers.utils.parseUnits("1.2", "gwei"),
          })
        ).to.changeEtherBalance(
          bidders[0],
          -ethers.utils.parseUnits("1.2", "gwei")
        );
        await expect(
          await AuctionContract.connect(bidders[1]).BidAuction(1, {
            value: ethers.utils.parseUnits("2.0", "gwei"),
          })
        ).to.changeEtherBalances(
          [bidders[1], bidders[0]],
          [
            -ethers.utils.parseUnits("2.0", "gwei"),
            ethers.utils.parseUnits("1.2", "gwei"),
          ]
        );
      });
      it("Not accepts low Bid", async function () {
        await AssetContract.connect(seller).Mint("IronMan");
        await AssetContract.connect(seller).Approve(1);
        await AuctionContract.connect(seller).CreateAuction(1, ethers.utils.parseEther('1.0'), 7200);
        await expect(AuctionContract.connect(bidders[0]).BidAuction(1,{value: ethers.utils.parseEther('0.1')}))
        .to.be.revertedWith('Bid Failed');
      });
      it("Should not accept bid when auction over but not claimed", async function () {
        await AssetContract.connect(seller).Mint("IronMan");
        await AssetContract.connect(seller).Approve(1);
        await AuctionContract.connect(seller).CreateAuction(1, ethers.utils.parseEther('0.5'), 7200);
        await expect(AuctionContract.connect(bidders[0]).BidAuction(1,{value: ethers.utils.parseEther('5.0')}))
        .to.emit(AuctionContract,"BidPlaced")
        .withArgs(1, bidders[0].address,ethers.utils.parseEther('5.0'));
        await network.provider.send("evm_increaseTime", [7200]);
        await network.provider.send("evm_mine");
        await expect(AuctionContract.connect(bidders[1]).BidAuction(1,{value: ethers.utils.parseEther('10.0')}))
        .to.be.revertedWith('Bid Failed');
      });
    });
    describe("Claim", function () {
        it("Claims when auction successfull", async function () {
          await AssetContract.connect(seller).Mint("IronMan");
          await AssetContract.connect(seller).Approve(1);
          // console.log("Seller Address: "+seller.address);
          // console.log("Bidder address"+bidders[0].address);
          // console.log(await AssetContract.connect(seller).balanceOf(seller.address));
          // console.log(await AssetContract.connect(bidders[0]).balanceOf(bidders[0].address));
          // console.log(await AssetContract.connect(seller).getOwnerAssets());
          await AuctionContract.connect(seller).CreateAuction(1, ethers.utils.parseEther('0.5'), 7200);
          await AuctionContract.connect(bidders[0]).BidAuction(1,{value: ethers.utils.parseEther('5.0')});
          await network.provider.send("evm_increaseTime", [7200]);
          await network.provider.send("evm_mine");
          await expect(AssetContract.connect(bidders[0]).Claim(1))
          .to.emit(AuctionContract,"AuctionSuccessful")
          .withArgs(1,ethers.utils.parseEther('5.0'),bidders[0].address);
          // console.log(await AssetContract.connect(seller).balanceOf(seller.address));
          // console.log(await AssetContract.connect(bidders[0]).balanceOf(bidders[0].address));
          // console.log(await AssetContract.connect(bidders[0]).getOwnerAssets());
          // console.log(await AssetContract.connect(seller).getOwnerAssets());
        });
        it("Should not be able to claim before Auction is finished", async function () {
          await AssetContract.connect(seller).Mint("IronMan");
          await AssetContract.connect(seller).Approve(1);
          await AuctionContract.connect(seller).CreateAuction(1, ethers.utils.parseEther('0.5'), 7200);
          await AuctionContract.connect(bidders[0]).BidAuction(1,{value: ethers.utils.parseEther('5.0')});
          await network.provider.send("evm_increaseTime", [4200]);
          await network.provider.send("evm_mine");
          await expect(AssetContract.connect(bidders[0]).Claim(1))
          .to.be.revertedWith('Auction is not Over yet');
        });
        it("Should restrict Claim only to the winner", async function () {
          await AssetContract.connect(seller).Mint("IronMan");
          await AssetContract.connect(seller).Approve(1);
          await AuctionContract.connect(seller).CreateAuction(1, ethers.utils.parseEther('0.5'), 7200);
          await AuctionContract.connect(bidders[0]).BidAuction(1,{value: ethers.utils.parseEther('5.0')});
          await network.provider.send("evm_increaseTime", [7200]);
          await network.provider.send("evm_mine");
          await expect(AssetContract.connect(bidders[1]).Claim(1))
          .to.be.revertedWith('Only Winner can Claim');
          await expect(AssetContract.connect(bidders[0]).Claim(1))
          .to.emit(AuctionContract,"AuctionSuccessful")
          .withArgs(1,ethers.utils.parseEther('5.0'),bidders[0].address);
        });
        it("Seller should be able to claim back if winner didn't claim", async function () {
          await AssetContract.connect(seller).Mint("IronMan");
          await AssetContract.connect(bidders[0]).Mint("Hulk");
          // console.log("Seller Address: "+seller.address);
          // console.log("Bidder Address: "+bidders[0].address);
          await AssetContract.connect(seller).Approve(1);
          await AuctionContract.connect(seller).CreateAuction(1, ethers.utils.parseEther('0.5'), 7200);
          await AuctionContract.connect(bidders[0]).BidAuction(1,{value: ethers.utils.parseEther('4.0')});
          await network.provider.send("evm_increaseTime", [93600]);
          await network.provider.send("evm_mine");
          expect(await AuctionContract.connect(seller).CancelAuction(1))
          .to.emit(AuctionContract,"AuctionCancelled")
          .withArgs(1)
          .to.changeEtherBalances([bidders[0],seller],[ethers.utils.parseEther('2.0'),ethers.utils.parseEther('1.0')]);
          expect(await AssetContract.connect(seller).ownerOf(1)).to.be.equal(seller.address);
          // console.log(await AssetContract.connect(seller).getOwnerAssets());
          // console.log(await AssetContract.connect(bidders[0]).getOwnerAssets());
        });
        it("Seller should not be able to claim if Claiming Period is not over", async function () {
          await AssetContract.connect(seller).Mint("IronMan");
          await AssetContract.connect(seller).Approve(1);
          await AuctionContract.connect(seller).CreateAuction(1, ethers.utils.parseEther('0.5'), 7200);
          await AuctionContract.connect(bidders[0]).BidAuction(1,{value: ethers.utils.parseEther('5.0')});
          await network.provider.send("evm_increaseTime", [33600]);
          await network.provider.send("evm_mine");
          await expect(AuctionContract.connect(seller).CancelAuction(1))
          .to.be.revertedWith('Claiming Period is not Over yet');
        });
    });
    describe("Cancel", function () {
        it("Cancels Auction", async function () {
          await AssetContract.connect(seller).Mint("IronMan");
          await AssetContract.connect(seller).Approve(1);
          await AuctionContract.connect(seller).CreateAuction(1, ethers.utils.parseEther('0.5'), 7200);
          expect(await AuctionContract.connect(seller).CancelAuction(1))
          .to.emit(AuctionContract,"AuctionCancelled")
          .withArgs(1);
        })
        it("Refunds Bid when cancelled", async function () {
          await AssetContract.connect(seller).Mint("IronMan");
          await AssetContract.connect(seller).Approve(1);
          await AuctionContract.connect(seller).CreateAuction(1, ethers.utils.parseUnits("1.0","gwei"), 7200);
          await AuctionContract.connect(bidders[0]).BidAuction(1,{value: ethers.utils.parseUnits("2.0","gwei")});
          await expect(await AuctionContract.connect(seller).CancelAuction(1))
          .to.changeEtherBalance(bidders[0],ethers.utils.parseUnits("2.0","gwei"));
        })
        it("Returns NFT to seller when Auction cancelled", async function () {
          await AssetContract.connect(seller).Mint("IronMan");
          await AssetContract.connect(seller).Approve(1);
          await AuctionContract.connect(seller).CreateAuction( 1, ethers.utils.parseUnits("1.0","gwei"), 7200);
          await AuctionContract.connect(seller).CancelAuction(1);
          expect(await AssetContract.ownerOf(1)).to.equal(seller.address);
        })
    });
  });
  describe("Administrative", function () {
    it("Only CEO Should be able to set new CEO", async function () {
      await expect(
        AssetContract.connect(CEO).SetCEO(CEO.address)
      ).to.be.revertedWith("Only CEO is Authorized");
      expect(await AssetContract.SetCEO(CEO.address))
        .to.emit(AssetContract, "CEOchanged")
        .withArgs(CEO.address);
    });
    it("Only CEO Should be able to set new CFO", async function () {
      await AssetContract.SetCEO(CEO.address);
      await expect(
        AssetContract.connect(seller).SetCEO(CFO.address)
      ).to.be.revertedWith("Only CEO is Authorized");
      expect(await AssetContract.connect(CEO).SetCFO(CFO.address))
        .to.emit(AssetContract, "CFOchanged")
        .withArgs(CFO.address);
    });
    it("Only Chiefs should be able to Pause Contract", async function () {
      await AssetContract.SetCEO(CEO.address);
      await AssetContract.connect(CEO).SetCFO(CFO.address);
      await expect(AssetContract.Pause()).to.be.revertedWith(
        "Only Chiefs is Authorized"
      );
      await expect(AssetContract.connect(CFO).Pause())
        .to.emit(AssetContract, "Paused")
        .withArgs(CFO.address);
    });
    it("When Paused no functionality should work", async function () {
      await AssetContract.SetCEO(CEO.address);
      await AssetContract.connect(CEO).SetCFO(CFO.address);
      await AssetContract.connect(CFO).Pause();
      await expect(AssetContract.Mint("AntMan")).to.be.revertedWith(
        "System is Paused"
      );
    });
    it("Only CEO should be able to Unpause Contract", async function () {
      await AssetContract.SetCEO(CEO.address);
      await AssetContract.connect(CEO).SetCFO(CFO.address);
      await AssetContract.connect(CFO).Pause();
      await expect(AssetContract.connect(CFO).Unpause()).to.be.revertedWith(
        "Only CEO is Authorized"
      );
      await expect(AssetContract.connect(CEO).Unpause())
        .to.emit(AssetContract, "Unpaused")
        .withArgs(CEO.address);
    });
  });
  describe("Real World Simulation", function () {
    it("Works Properly in real world conditions", async function () {
      await AssetContract.connect(bidders[0]).Mint("IronMan");
      await AssetContract.connect(bidders[0]).Mint("Hulk");
      await AssetContract.connect(bidders[1]).Mint("Hawkeye");
      await AssetContract.connect(bidders[0]).Mint("Captain America");
      await AssetContract.connect(bidders[1]).Mint("Black Panther");
      await AssetContract.connect(bidders[1]).Mint("Thor");
      await AssetContract.connect(bidders[1]).Mint("Black Widow");
      await AssetContract.connect(bidders[1]).Mint("Falcon");
      // console.log(await AssetContract.connect(bidders[0]).getOwnerAssets());
      await AssetContract.connect(bidders[1]).Burn(5);
      await AssetContract.connect(bidders[1]).Burn(7);
      // console.log(await AssetContract.connect(bidders[1]).getOwnerAssets());
      // console.log(await AssetContract.getAllAssets());
      await AssetContract.connect(bidders[0]).Approve(1);
      await AssetContract.connect(bidders[0]).Approve(2);
      await AssetContract.connect(bidders[1]).Approve(3);
      await AssetContract.connect(bidders[0]).Approve(4);
      await AssetContract.connect(bidders[1]).Approve(6);
      await AssetContract.connect(bidders[1]).Approve(8);
      await AuctionContract.connect(bidders[0]).CreateAuction(1,100,4100);
      await AuctionContract.connect(bidders[0]).CreateAuction(4,100,4200);
      await AuctionContract.connect(bidders[1]).CreateAuction(6,100,4300);
      await AuctionContract.connect(bidders[0]).CreateAuction(2,100,4400);
      await AuctionContract.connect(bidders[1]).CreateAuction(3,100,4500);
      await AuctionContract.connect(bidders[1]).CreateAuction(8,100,4600);
      // console.log(await AuctionContract.connect(bidders[0]).getAllAuctions());
      await network.provider.send("evm_increaseTime", [1000]);
      await network.provider.send("evm_mine");

      await AuctionContract.connect(bidders[2]).BidAuction(4,{value: 1000});
      await network.provider.send("evm_increaseTime", [4300]);
      await network.provider.send("evm_mine");
      await AssetContract.connect(bidders[2]).Claim(4);
      // console.log(await AuctionContract.connect(bidders[0]).assetsOnAuction());
      // console.log(await AssetContract.connect(bidders[2]).getOwnerAssets());
      await AuctionContract.connect(bidders[2]).BidAuction(1,{value: 1000});
      await AuctionContract.connect(bidders[2]).BidAuction(2,{value: 1000});
      await AuctionContract.connect(bidders[2]).BidAuction(6,{value: 1000});
      await AuctionContract.connect(bidders[2]).BidAuction(3,{value: 1000});
      await AuctionContract.connect(bidders[2]).BidAuction(8,{value: 1000});
      await network.provider.send("evm_increaseTime", [4300]);
      await network.provider.send("evm_mine");
      await AuctionContract.connect(bidders[1]).CancelAuction(3);
      await network.provider.send("evm_increaseTime", [4300]);
      await network.provider.send("evm_mine");
      await AssetContract.connect(bidders[2]).Claim(6);
      await AssetContract.connect(bidders[2]).Claim(8);
      // console.log(await AuctionContract.connect(bidders[1]).assetsOnAuction());
      // console.log(await AssetContract.connect(bidders[1]).getOwnerAssets());
      // await AuctionContract.connect(bidders[0]).BidAuction(1,{value: ethers.utils.parseEther('5.0')});
    })
  })
});
