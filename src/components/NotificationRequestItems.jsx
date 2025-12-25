import { Droplet, MapPin, Check, X } from "lucide-react";
import { useState } from "react";

const NotificationRequestItem = ({ data }) => {
    const [status, setStatus] = useState("pending");

    return (
        <div className="bg-[#2C2B3C] rounded-lg p-3 text-sm">
            <div className="flex justify-between items-center mb-1">
                <span className="flex items-center gap-1 text-red-500 font-semibold">
                    <Droplet size={14} /> {data.bloodGroup}
                </span>
            </div>

            <p className="font-semibold">{data.patient}</p>

            <p className="flex items-center gap-1 text-gray-400">
                <MapPin size={12} /> {data.city}
            </p>

            {status === "pending" ? (
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => setStatus("accepted")}
                        className="flex-1 bg-green-600 hover:bg-green-700 rounded py-1 flex justify-center"
                    >
                        <Check size={14} />
                    </button>
                    <button
                        onClick={() => setStatus("declined")}
                        className="flex-1 bg-red-600 hover:bg-red-700 rounded py-1 flex justify-center"
                    >
                        <X size={14} />
                    </button>
                </div>
            ) : (
                <p className="mt-2 text-xs text-center text-gray-300">
                    {status === "accepted" ? "Accepted" : "Declined"}
                </p>
            )}
        </div>
    );
};

export default NotificationRequestItem;