"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect } from "react";

import { CirclePlus, Copy, LinkIcon, Users } from "lucide-react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";

const UserCard: React.FC<{
  name?: string;
  publicKey?: string;
  created?: boolean;
}> = ({ name, publicKey, created }) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    fetch("/api/user/getIndex")
      .then((res) => res.json())
      .then((data: { index: number }) => setIndex(data.index))
      .catch((err) => console.error(err));
  }, []);

  if (name && publicKey && !created) {
    return (
      <div className="bg-gray-300 rounded-xl px-6 py-8 whitespace-nowrap max-w-md w-full">
        <div>
          <h1 className="font-light">ID</h1>
          <h2 className="font-bold text-xl">{name}</h2>
        </div>
        <div>
          <h1 className="font-light">Public Key</h1>
          <h2 className="font-bold text-xl text-ellipsis overflow-hidden">
            {publicKey}
          </h2>
        </div>
        <div>
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
            공개키 복사하기
          </button>
          <Link
            href={`/user/${name}`}
            className="flex items-center gap-2 transition hover:bg-gray-400 w-fit p-2 rounded-xl"
          >
            <LinkIcon />
            유저 프로필 조회하기
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <button
          className="border-dashed border-2 border-gray-300 rounded-xl px-6 py-8 whitespace-nowrap max-w-md w-full"
          onClick={open}
        >
          <div className="w-full flex items-center">
            <CirclePlus className="w-24 font-black mx-auto" />
          </div>
        </button>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={close}>
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
                      <Users size={32} className="mx-auto" />
                      <span className="block mt-2">새로운 유저 추가</span>
                    </DialogTitle>

                    <div className="mt-4 w-fit mx-auto">
                      <label className="block text-xl font-bold text-gray-700">
                        아이디
                      </label>
                      <input
                        type="text"
                        className="mt-1 block border-gray-300 border-b-2 transition duration-500 focus:ring-blue-500 focus:border-blue-500 focus:outline-none sm:text-sm"
                        value={index}
                        disabled
                      />
                    </div>

                    <div className="mt-4 w-full flex justify-center gap-4">
                      <button
                        type="button"
                        className="w-1/3 inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                        onClick={close}
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        className="w-1/3 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={async () => {
                          await fetch("/api/user/", {
                            method: "POST",
                            body: JSON.stringify({
                              id: index,
                            }),
                          });
                          setIndex(index + 1);
                          close();
                          router.refresh();
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
      </>
    );
  }
};

export default UserCard;
