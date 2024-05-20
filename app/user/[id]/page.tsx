"use client";

import React, { Fragment, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import crypto from "crypto";
import {
  ArrowRight,
  Copy,
  HardHat,
  Pickaxe,
  Receipt,
  Truck,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";

import IBlock from "@database/models/types/IBlock";
import ITransaction from "@database/models/types/ITransaction";

const Page: React.FC = () => {
  const params: { id: string } = useParams<{ id: string }>();
  const [publicKey, setPublicKey] = React.useState<string>("");
  const [privateKey, setPrivateKey] = React.useState<string>("");
  const [tradeIsOpen, setTradeIsOpen] = React.useState<boolean>(false);
  const [mineIsOpen, setMineIsOpen] = React.useState<boolean>(false);

  const [targetId, setTargetId] = React.useState<string>("");
  const [productName, setProductName] = React.useState<string>("");
  const [count, setCount] = React.useState<number>(0);
  const [message, setMessage] = React.useState<string>("");
  const [warningMessage, setWarningMessage] = React.useState<string>("");

  const [transactions, setTransactions] = React.useState<Array<ITransaction>>(
    [],
  );
  const [blocks, setBlocks] = React.useState<IBlock[]>([]);
  const [nonce, setNonce] = React.useState<number>(0);
  const [hash, setHash] = React.useState<string>("");
  const [difficulty, setDifficulty] = React.useState<number>(2);
  const [isRunning, setIsRunning] = React.useState<boolean>(false);

  const TradeOpen = () => {
    setTradeIsOpen(true);
  };

  const TradeClose = () => {
    setTradeIsOpen(false);
  };

  const MineOpen = () => {
    setMineIsOpen(true);
  };

  const MineClose = () => {
    setMineIsOpen(false);
  };

  const router = useRouter();

  useEffect(() => {
    fetch(`/api/user?id=${params.id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data: { _id: number; publicKey: string; privateKey: string }) => {
        setPublicKey(data.publicKey);
        setPrivateKey(data.privateKey);
      })
      .catch(() => {
        router.push("/_not-found");
      });
  }, [params.id, router]);

  useEffect(() => {
    fetch("/api/transaction", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
      })
      .catch(() => {
        router.push("/_not-found");
      });
  }, [params.id, router]);

  useEffect(() => {
    fetch("/api/block", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data: IBlock[]) => {
        setBlocks(data);
      })
      .catch(() => {
        router.push("/_not-found");
      });
  }, [params.id, router]);

  useEffect(() => {
    const previousHash = blocks[blocks.length - 1]
      ? crypto
          .createHash("SHA256")
          .update(JSON.stringify(blocks[blocks.length - 1]))
          .digest("hex")
      : "";
    setHash(
      crypto
        .createHash("SHA256")
        .update(
          JSON.stringify({
            previousHash,
            transactions,
            nonce,
            difficulty,
          }),
        )
        .digest("hex"),
    );
  }, [nonce, blocks, transactions, difficulty]);

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;
    if (isRunning) {
      intervalId = setInterval(() => {
        setNonce(nonce + 1);
      }, 20);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, nonce]);

  useEffect(() => {
    if (hash.startsWith("0".repeat(difficulty))) {
      setIsRunning(false);
    }
  }, [hash, difficulty]);

  useEffect(() => {
    for (let i = 1; i < blocks.length; i++) {
      if (
        crypto
          .createHash("SHA256")
          .update(JSON.stringify(blocks[i - 1]))
          .digest("hex") !== blocks[i].previousHash
      ) {
        setWarningMessage(
          "블록 구조가 유효하지 않습니다. 새로고침하여 다시 설정하십시오.",
        );
        return;
      }
    }
  }, [blocks]);

  const changeBlockIdx = (currentIdx: number, newIdx: number) => {
    if (
      newIdx < 0 ||
      newIdx >= blocks.length ||
      currentIdx < 0 ||
      currentIdx >= blocks.length
    ) {
      console.log("Invalid index");
      return;
    }

    // 새 블록 배열 생성 (깊은 복사)
    let newBlocks = [...blocks];

    // 블록 교환
    const temp = newBlocks[currentIdx];
    newBlocks[currentIdx] = newBlocks[newIdx];
    newBlocks[newIdx] = temp;

    // 상태 업데이트
    setBlocks(newBlocks);
  };

  return (
    <div className="min-h-screen md:px-36 p-16">
      <div className="w-full">
        <User size={64} />
        <h1 className="flex items-center gap-1.5 text-xl mt-4 text-center">
          아이디 : <span className="font-black text-2xl">{params.id}</span>
        </h1>
        <div>
          <h1 className="text-xl mt-4 text-ellipsis overflow-hidden">
            공개키 :
          </h1>
          <textarea
            rows={4}
            className="block p-2.5 max-w-md w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={publicKey}
            disabled
          ></textarea>
          <button
            className="rounded-xl p-2 transition duration-200 hover:bg-gray-400 flex items-center gap-2"
            onClick={() => {
              window.navigator.clipboard
                .writeText(publicKey)
                .then(() => alert("성공적으로 유저 공개키를 복사하였습니다."))
                .catch((err) => {
                  alert("공개키 복사에 실패하였습니다.");
                  console.error(err);
                });
            }}
          >
            <Copy size={20} className="text-black" />
          </button>
        </div>
        <div>
          <h1 className="text-xl mt-4 text-ellipsis overflow-hidden">
            비밀키 :
          </h1>
          <textarea
            rows={4}
            className="block p-2.5 max-w-md w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={privateKey}
            disabled
          ></textarea>
          <button
            className="rounded-xl p-2 transition duration-200 hover:bg-gray-400 flex items-center gap-2"
            onClick={() => {
              window.navigator.clipboard
                .writeText(privateKey)
                .then(() => alert("성공적으로 유저 비밀키를 복사하였습니다."))
                .catch((err) => {
                  alert("비밀키 복사에 실패하였습니다.");
                  console.error(err);
                });
            }}
          >
            <Copy size={20} className="text-black" />
          </button>
        </div>
        <div className="mt-2 flex gap-2">
          <button
            className="flex items-center rounded-xl bg-blue-200 text-black px-4 py-2 gap-2 transition duration-300 hover:bg-blue-300 hover:scale-105"
            onClick={TradeOpen}
          >
            <Truck />
            제품 전달
          </button>
          <button
            className="flex items-center rounded-xl bg-yellow-600 px-4 py-2 gap-2 transition duration-300 hover:bg-yellow-700 hover:scale-105 text-white"
            onClick={MineOpen}
          >
            <Pickaxe />
            채굴
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {blocks.map((block: IBlock, blockIdx) => (
            <div
              className="bg-gray-300 rounded-xl px-6 py-8 whitespace-nowrap max-w-md w-full grid grid-cols-2"
              key={blockIdx}
            >
              <div className="">
                <h2 className="text-xl font-light">Index</h2>
                <input
                  type="number"
                  className="text-2xl font-bold w-2/3 bg-transparent border-b-2 focus:outline-none"
                  value={block.index}
                  onChange={(e) => {
                    const newIdx = parseInt(e.target.value, 10);
                    if (!isNaN(newIdx) && newIdx !== blockIdx) {
                      changeBlockIdx(blockIdx, newIdx);
                    }
                  }}
                ></input>
              </div>
              <div>
                <h2 className="text-xl font-light">Nonce</h2>
                <h1 className="text-2xl font-bold">{block.nonce}</h1>
              </div>
              <div>
                <h2 className="text-xl font-light">Difficulty</h2>
                <h1 className="text-2xl font-bold">{block.difficulty}</h1>
              </div>
              <div>
                <h2 className="text-xl font-light w-1/2">Transactions</h2>
                {block.transactions.map(
                  (transaction: ITransaction, transactionIdx) => (
                    <div className="flex gap-2" key={transactionIdx}>
                      <h1 className="text-center">
                        {transaction.senderId !== undefined
                          ? transaction.senderId
                          : "Initial"}
                      </h1>
                      <ArrowRight />
                      <h1>{transaction.targetId}</h1>
                      <h1>
                        {transaction.productName} ( {transaction.count} )
                      </h1>
                    </div>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
        <div>
          <h1>{warningMessage}</h1>
        </div>
      </div>
      <Transition appear show={tradeIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={TradeClose}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-center text-xl font-bold leading-6 text-gray-900"
                  >
                    <Receipt size={32} className="mx-auto" />
                    <span className="block mt-2">거래</span>
                  </DialogTitle>

                  <div className="mt-4 w-2/3 mx-auto">
                    <label className="block text-xl font-bold text-gray-700">
                      수령인 아이디
                    </label>
                    <input
                      type="text"
                      className="w-full mt-1 block border-gray-300 border-b-2 transition duration-500 focus:ring-blue-500 focus:border-blue-500 focus:outline-none sm:text-sm"
                      value={targetId}
                      onChange={(e) => {
                        setTargetId(e.target.value);
                        if (e.target.value === params.id) {
                          setMessage("본인의 아이디를 제외해주세요.");
                          return;
                        }
                        fetch(`/api/user/invalid?id=${e.target.value}`, {
                          method: "GET",
                        })
                          .then((res) => res.json())
                          .then((data: { status: number }) => {
                            console.log(data);
                            if (data.status !== 200) {
                              setMessage("아이디를 확인해주세요.");
                            } else {
                              setMessage("");
                            }
                          })
                          .catch(() => {
                            setMessage("아이디를 확인해주세요.");
                          });
                      }}
                    />
                    {message && (
                      <label className="text-red-400">{message}</label>
                    )}
                  </div>

                  <div className="mt-4 w-2/3 mx-auto">
                    <label className="block text-xl font-bold text-gray-700">
                      제품
                    </label>
                    <input
                      type="text"
                      className="w-full mt-1 block border-gray-300 border-b-2 transition duration-500 focus:ring-blue-500 focus:border-blue-500 focus:outline-none sm:text-sm"
                      value={productName}
                      onChange={(e) => {
                        setProductName(e.target.value);
                      }}
                    />
                  </div>

                  <div className="mt-4 w-2/3 mx-auto">
                    <label className="block text-xl font-bold text-gray-700">
                      수량
                    </label>
                    <input
                      type="number"
                      className="w-full mt-1 border-gray-300 border-b-2 transition duration-500 focus:ring-blue-500 focus:border-blue-500 focus:outline-none sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={count}
                      onChange={(e) => {
                        if (parseInt(e.target.value) >= 0) {
                          setCount(parseInt(e.target.value));
                        }
                      }}
                    />
                  </div>

                  <div className="mt-4 w-full flex justify-center gap-4">
                    <button
                      type="button"
                      className="w-1/3 inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={TradeClose}
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      className="w-1/3 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={async () => {
                        await fetch("/api/transaction", {
                          method: "POST",
                          body: JSON.stringify({
                            senderId: parseInt(params.id),
                            targetId: parseInt(targetId),
                            productName,
                            count,
                          }),
                        });
                        try {
                          const getTransactions = await (
                            await fetch("/api/transaction", {
                              method: "GET",
                            })
                          ).json();
                          setTransactions(getTransactions);
                          TradeClose();
                          router.refresh();
                        } catch {
                          router.push("/_not-found");
                        }
                      }}
                    >
                      생성
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={mineIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={MineClose}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-center text-xl font-bold leading-6 text-gray-900"
                  >
                    <HardHat size={32} className="mx-auto" />
                    <span className="block mt-2">채굴</span>
                  </DialogTitle>

                  <div className="mt-4 w-2/3 mx-auto">
                    <label className="block text-xl font-bold text-gray-700">
                      거래
                    </label>
                    <div className="flex flex-nowrap gap-2 overflow-auto">
                      {transactions.map((transaction: ITransaction, index) => (
                        <div
                          key={index}
                          className="bg-gray-300 px-4 py-2 rounded-xl w-1/2"
                        >
                          <h1 className="font-light block">
                            Index
                            <h2 className="font-bold text-xl">
                              {transaction.index}
                            </h2>
                          </h1>
                          <h1 className="font-light block">
                            Hash
                            <h2 className="font-bold text-xl text-ellipsis overflow-hidden whitespace-nowrap">
                              {transaction.previousHash
                                ? transaction.previousHash
                                : "최초 거래"}
                            </h2>
                          </h1>
                        </div>
                      ))}
                    </div>
                  </div>
                  {transactions.length ? (
                    <>
                      <div className="mt-4 w-2/3 mx-auto">
                        <label className="block text-xl font-bold text-gray-700">
                          Nonce
                        </label>
                        <input
                          type="number"
                          className="w-full mt-1 border-gray-300 border-b-2 transition duration-500 focus:ring-blue-500 focus:border-blue-500 focus:outline-none sm:text-sm"
                          value={nonce}
                          onChange={(e) => {
                            if (parseInt(e.target.value) >= 0) {
                              setNonce(parseInt(e.target.value));
                            }
                          }}
                        />
                      </div>
                      <div className="mt-4 w-2/3 mx-auto">
                        <label className="block text-xl font-bold text-gray-700">
                          Difficulty
                        </label>
                        <input
                          type="number"
                          className="w-full mt-1 border-gray-300 border-b-2 transition duration-500 focus:ring-blue-500 focus:border-blue-500 focus:outline-none sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          value={difficulty}
                          onChange={(e) => {
                            if (parseInt(e.target.value) >= 0) {
                              setDifficulty(parseInt(e.target.value));
                            }
                          }}
                        />
                      </div>
                      <div className="mt-4 w-2/3 mx-auto">
                        <label className="block text-xl font-bold text-gray-700">
                          Hash
                        </label>
                        <input
                          type="text"
                          className="w-full mt-1 border-gray-300 border-b-2 transition duration-500 focus:ring-blue-500 focus:border-blue-500 focus:outline-none sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          value={hash}
                        />
                      </div>
                      <div className="mt-4 w-2/3 mx-auto flex gap-2">
                        <button
                          className="px-4 py-2 rounded-xl bg-red-400 text-white"
                          onClick={() => setIsRunning(true)}
                        >
                          채굴하기
                        </button>
                        {hash.startsWith("0".repeat(difficulty)) && (
                          <button
                            className="px-4 py-2 rounded-xl bg-blue-400 text-white"
                            onClick={async () => {
                              await fetch("/api/block", {
                                method: "POST",
                                body: JSON.stringify({
                                  previousHash: blocks[blocks.length - 1]
                                    ? crypto
                                        .createHash("SHA256")
                                        .update(
                                          JSON.stringify(
                                            blocks[blocks.length - 1],
                                          ),
                                        )
                                        .digest("hex")
                                    : "",
                                  transactions,
                                  nonce,
                                  difficulty,
                                }),
                              });
                              router.refresh();
                              MineClose();
                            }}
                          >
                            블록 업로드
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <h1 className="text-center text-xl font-bold mt-2">
                      작업증명할 거래가 없습니다.
                    </h1>
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Page;
