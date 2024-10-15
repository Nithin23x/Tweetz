import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFollow = () => {
	const queryClient = useQueryClient();

	const { mutate: follow, isPending } = useMutation({
		mutationFn: async (userId) => {
			try {
				const res = await fetch(`/api/v1/app/follow/${userId}`, {
					method: "POST",
				});

				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong!");
				}
				return data?.data; 
			} catch (error) {
				throw new Error(error.message);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey:"authUser"});
			queryClient.invalidateQueries({ queryKey: ["userProfile"] });
			queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return { follow, isPending };
};

export default useFollow;
