import React, { useCallback, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import user from '../../../back/models/user';
import { DELETE_COMMENT_REQUEST, RECOMMENT_TOGGLE } from '../../reducer/post';
import CommentInput from './CommentInput';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

const CommentCotent = ({comment, user}) => {
    const { RecommentInfo, onePost } = useSelector(state => state.post);
    const dispatch = useDispatch();
    const [reply, setReply] = useState(false);
    const [open, setOpen] = useState(false);
    
    useEffect(() => {
        RecommentInfo === comment && setReply('reply')
        RecommentInfo !== comment && setReply(false);
    },[comment, RecommentInfo])

    const onClickdeleteComment = useCallback(() => {
        dispatch({
            type : DELETE_COMMENT_REQUEST,
            id : comment.id
        })
    },[comment])
    
    const onClickCoverUp = useCallback(() => {
        dispatch({
            type : COVER_POST,
            id : comment?.User?.id
        })
    },[comment])
    
    const onClickReply = useCallback(() => {
        RecommentInfo !== comment && dispatch({
            type : RECOMMENT_TOGGLE,
            data : {
                comment : comment
            }
        })
        RecommentInfo === comment && dispatch({
            type : RECOMMENT_TOGGLE,
            data : { comment : null }
        })
},[comment, RecommentInfo])

const onClickOpenReply = useCallback(() => {
    setOpen(prev => !prev)
},[])

    return (
        <>
         <div className={reply || 'none'}>
        <div className="imgspan">
        <img onClick={onClickCoverUp} src={`http://localhost:3055/${comment?.User?.Images[0]?.src}`} />
        <span onClick={onClickCoverUp}>{comment?.User?.nickname}</span>
        {comment?.User?.id === user.id && <span className="delete" onClick={onClickdeleteComment}>{' 삭제'}</span>}
    </div>
<div className="commentDiv">
    <pre className="comment">- {comment?.content}</pre>
</div>
<div className="day">{moment(comment?.createdAt).format('YYYY.MM.DD')}
<sapn onClick={onClickReply} className="recommentbtn"> - 답글 </sapn>
     { open ? <UpOutlined onClick={onClickOpenReply} className="down" /> :
      <DownOutlined onClick={onClickOpenReply} className='down'/>}
</div>
</div>
<div className="replycontent">
    {onePost.Comments.map(v => open && v.CommentId === comment.id && 
    <>
       <CommentCotent comment={v} user={v.User} />
     </>   )}
</div>
</>
    )
}

export default CommentCotent
