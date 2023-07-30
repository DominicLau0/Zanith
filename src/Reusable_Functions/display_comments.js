import React from 'react'

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

                                    return(
                                        <p className="usernameComment">{Object.keys(comments)[0]} <span className="dateCommentStyle" title={date.toString()}>{date.toDateString() + " @ " + date.toLocaleTimeString()}</span></p>
                                    )
                                })()
                            }
                            <p className="commentText" id={comments.id}>{comments[Object.keys(comments)[0]]}</p>
                        </div>
                        {
                            (() => {
                                if(props.song.username === Object.keys(comments)[0]){
                                    return(
                                        <div className="buttonCommentBar">
                                            <button className='commentButtonModifier' onClick={() => props.deleteComment(comments.id)}>Delete</button>
                                        </div>
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