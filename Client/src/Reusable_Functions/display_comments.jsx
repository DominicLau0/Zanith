import { Button } from "@/components/ui/button"
import { MdDelete } from "react-icons/md";

export default function DisplayComments(props){ 
    return(
        <div id="commentSection">
            {props.commentState.map(comments => {
                return(
                    <div className="commentSection" key={comments.id} id={`comment-section:${comments.id}`}>
                        <div className="commentBar">
                            {
                                (() => {
                                    let date = new Date(comments[Object.keys(comments)[2]]);

                                    if(props.song.username === props.song.song[0].username){
                                        return(
                                            <p className="usernameComment">{Object.keys(comments)[0]}
                                                <span className="creator">Creator</span>
                                                <span className="dateCommentStyle" title={date.toString()}>{date.toDateString() + " @ " + date.toLocaleTimeString()}</span>
                                            </p>
                                        )
                                    }else{
                                        return(
                                            <p className="usernameComment">{Object.keys(comments)[0]}
                                                <span className="dateCommentStyle" title={date.toString()}>{date.toDateString() + " @ " + date.toLocaleTimeString()}</span>
                                            </p>
                                        )
                                    }
                                })()
                            }
                            <p className="commentText" id={comments.id}>{comments[Object.keys(comments)[0]]}</p>
                        </div>
                        {
                            (() => {
                                if(props.song.username === Object.keys(comments)[0]){
                                    return(
                                        <Button>
                                            <MdDelete onClick={() => props.deleteComment(comments.id)}/>
                                        </Button>
                                    )
                                }
                            })()
                        }
                    </div>
                )
            })}
        </div>
    )
}