import React = require('react');

// TODO we need to replace this with a configurable button as per Argo CD
export const ChatButton = () => (
    <div style={{position: 'fixed', right: 10, bottom: 10}}>
        <a href='https://docs.google.com/document/d/1VHwp53QMPoUVACiyWFXriktxwSznEW1ZsQqJHrZklO8/edit?usp=sharing' className='argo-button argo-button--special'>
            <i className='fas fa-comment-alt' /> Give feedback on the v3 UI
        </a>
    </div>
);
