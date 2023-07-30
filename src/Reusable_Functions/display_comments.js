import React from 'react'

export default function DisplayComments(props){ 
    return(
        <div id="commentSection">
            {props.commentState.map(comments => {
                return(
                    <div className="commentSection" key={comments.id} id={`comment-section:${comments.id}`}>
                        <div className="commentBar">
                            <p className="usernameComment">{Object.keys(comments)[0]}</p>
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