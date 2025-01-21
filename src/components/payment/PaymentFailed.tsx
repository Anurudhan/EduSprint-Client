import React, { useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { useNavigate } from "react-router-dom";
import { deleteObject } from "../../utilities/localStorage";

export const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    deleteObject("payment_session");
    deleteObject("subscription-session");
  }, []);

  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col justify-center items-center border-2 py-12 px-6 md:px-12 bg-gray-900 rounded-2xl ">
          <div className="mb-6 px-20">
            <Player
              autoplay
              loop
              src="https://lottie.host/ea6a85c0-db5a-4b20-8d68-a9e5be46a326/XZqpXhdCSB.lottie"
              style={{ height: "200px", width: "200px" }}
            />
          </div>
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-orange-400 text-center">
              Payment Failed
            </h2>
          </div>
          <div>
            <button
              className="btn btn-warning btn-outline rounded-full"
              onClick={() => navigate("/courses")}>
              Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
};