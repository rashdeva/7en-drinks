import { config } from "~/config";
import { QuestFormData } from "~/pages/admin/quests/components/zod";
import { PaymentModel, PaymentStatus, UserRank } from "./models";

export const drinkWaterCup = async () => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${config.apiUrl}/api/drink/cup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching events", error);
    throw error;
  }
};

export const drinkWaterDrop = async ({
  amount,
  token,
}: {
  amount: number;
  token: string;
}) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${config.apiUrl}/api/drink/drop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "x-game-token": token,
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error tapping water drop", error);
    throw error;
  }
};

export const addQuest = async (formData: QuestFormData) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${config.apiUrl}/api/quests/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error tapping water drop", error);
    throw error;
  }
};

export const updateQuest = async ({
  id,
  formData,
}: {
  id: string;
  formData: QuestFormData;
}) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${config.apiUrl}/api/quests/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating quest", error);
    throw error;
  }
};

export const updateEvent = async (eventId: string, updateData: any) => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(`${config.apiUrl}/api/events/${eventId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error("Failed to update the event");
  }

  return response.json();
};

export const fetchQuests = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${config.apiUrl}/api/quests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchQuests:", error);
    throw error;
  }
};

export const completeQuest = async (data: any) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${config.apiUrl}/api/quests/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      console.log(error);
      throw new Error(error.message || "Something went wrong");
    }

    return response.json();
  } catch (error) {
    console.error("Error in completeQuest:", error);
    throw error;
  }
};

export const checkCombination = async (data: number[]) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${config.apiUrl}/api/combo/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      console.log(error);
      throw new Error(error.message || "Something went wrong");
    }

    return response.json();
  } catch (error) {
    console.error("Error in completeQuest:", error);
    throw error;
  }
};

export const todayCombination = async (): Promise<{
  combination: number[];
}> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${config.apiUrl}/api/combo/today`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    return response.json();
  } catch (error) {
    console.error("Error in completeQuest:", error);
    throw error;
  }
};

export const completeOnboarding = async () => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${config.apiUrl}/api/users/onboarding/complete`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to complete onboarding");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to onboard User", error);
    throw error;
  }
};

export const fetchTop25 = async (): Promise<UserRank[]> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${config.apiUrl}/api/leaderboard/top`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    const users = (await response.json()) as any[];

    return users.map((user) => ({
      _id: user._id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      balance: user.balance,
      rank: user.rank,
    }));
  } catch (error) {
    console.error("Error in completeQuest:", error);
    throw error;
  }
};

export const fetchMyRank = async (): Promise<number> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${config.apiUrl}/api/leaderboard/rank`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Something went wrong");
    }

    return response.json();
  } catch (error) {
    console.error("Error in completeQuest:", error);
    throw error;
  }
};

// Payment status API
export const getPaymentStatus = async (
  orderId: string
): Promise<PaymentStatus> => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${config.apiUrl}/api/payments/status?orderId=${orderId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching payment status", error);
    throw error;
  }
};

// Notify backend that TON payment has been initiated
export const notifyTonPaymentInitiated = async (
  orderId: string
): Promise<{ success: boolean }> => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `${config.apiUrl}/api/payments/ton/initiated`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ orderId }),
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error notifying TON payment initiation", error);
    throw error;
  }
};

export const checkInTonPayment = async (data: {
  userAddress: string;
}): Promise<PaymentModel> => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(`${config.apiUrl}/api/payments/check-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      ...data,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to init payment");
  }

  return await response.json();
};