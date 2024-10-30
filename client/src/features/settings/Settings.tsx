import { ReactNode, useEffect } from "react"
import { useDeletePostMutation, useGetDeletedPostsQuery, useRestorePostMutation } from "../api/apiSlice"
import { Spinner } from "../../components/Spinner";

const DELETE = 'delete';
const RESTORE = 'restore';

export const Settings = () => {

    const { data, isSuccess, error, isLoading, refetch } = useGetDeletedPostsQuery();
    const [ restore, { isLoading: isRestoring }] = useRestorePostMutation();
    const [ deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

    useEffect(() => {
        refetch();
    }, [refetch]);

    console.log("data -> ", data);  

    const handleRestore = (id: string, type: string) => {
        console.log("handleRestore -> ", id); 
        if(type === RESTORE && window.confirm("Are you sure you want to restore this post?")) {
            restore({id});
        }

        if(type === DELETE && window.confirm("Are you sure you want to delete this post permanently?")) {
            deletePost(id);
        }
    }

    if(!isSuccess) return <div>Error: {JSON.stringify(error)}</div>

    if(isLoading || isRestoring || isDeleting) return <Spinner text={isLoading ? "fetching..." : isRestoring ? "restoring..." : "deleting..."} size={"5"}/>

    const postTitles : ReactNode[] = []
    return (
        <main className="mt-6">
            <h2 className="text-white text-2xl mb-4">Bin</h2>
            <div className="bg-gray-800 p-6">
                <ul className="bg-gray-900 text-gray-300">
                    {
                        data.map(post => (
                            <li key={post.id} className="flex bg-gray-800 justify-between my-1 py-2 px-2 ">
                                <h6 className="text-white p-1">{post.content}</h6>
                                <div className="space-x-4">
                                    <button className="text-green-500 p-1 px-2 rounded hover:text-green-400 hover:bg-gray-700" onClick={() => handleRestore(post.id, RESTORE)}>Restore</button>
                                    <button className="text-red-500 p-1 px-2 rounded hover:text-red-400 hover:bg-gray-700" onClick={() => handleRestore(post.id, DELETE)}>Delete Permanently</button>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </main>
    )
}