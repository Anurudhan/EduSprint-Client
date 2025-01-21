import React, { useEffect, useRef } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from "react-router-dom";
import { deleteObject, getObject } from "../../utilities/localStorage";
import { useAppDispatch } from "../../hooks/hooks";
import { editCourse } from "../../redux/store/actions/course/editCourse";
import { createPaymentAction } from "../../redux/store/actions/payment/createPaymentAction";

export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      console.log("useEffect triggered");
      createPayment();
      isFirstRun.current = false;
    }
  });

//   const createNewChat = async (studentId: string, instructorId: string) => {
//     const response = await dispatch(
//       createChatAction({
//         participants: [studentId, instructorId],
//       })
//     );
//     console.log(response, "text");
//   };

  const createPayment = async () => {
    console.log("createPayment called");
    const paymentSession = getObject("payment_session");
    console.log(paymentSession, "payment session");

    if (!paymentSession) {
      navigate("/");
      return;
    }

    try {
      await dispatch(
        editCourse({
          data: { _id: paymentSession.courseId,
           },
           studentId:paymentSession.userId,
          incrementStudentsEnrolled: true,
        })
      );

      const createPaymentData = {
        userId: paymentSession.userId,
        instructorId: paymentSession.instructorId,
        courseId: paymentSession.courseId,
        method: "card",
        status: "completed",
        amount: paymentSession.amount,
      };

      const response1 = await dispatch(createPaymentAction(createPaymentData));
      console.log(response1, "create payment response");

    //   if (!response1.payload?.success) {
    //     throw new Error("Payment creation failed!");
    //   } else {
    //     await createNewChat(paymentSession.userId, paymentSession.instructorId);
    //   }

      deleteObject("payment_session");
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col justify-center items-center border-2 py-12 px-6 md:px-12 bg-gray-900 rounded-2xl">
        <div className="mb-6">

    <DotLottieReact
      src="https://lottie.host/9825e422-f313-4b08-9c90-eb353ee93a58/p3hvajHxQk.lottie"
      loop
      autoplay
    />
        </div>
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold text-green-600 text-center">
            Payment Successful
          </h2>
        </div>
        <div>
          <button
            onClick={() => navigate("/")}
            className="btn btn-success btn-outline rounded-full text-white">
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};