import React, { Component, Fragment } from 'react';

import Layout from '../components/layout';

import './registration.css';

class RegistrationPage extends Component {
    state = {
        login: '',
        password: '',
        avatar: ''
    }

    setFileName(str: string) {
        if (str.lastIndexOf('\\')) {
            var i = str.lastIndexOf('\\') + 1;
        }
        else {
            var i = str.lastIndexOf('/') + 1;
        }
        var filename = str.slice(i);
        var uploaded = (document.getElementById("fileformlabel") as HTMLElement);
        uploaded.innerHTML = filename;
    }

    registerUser() {
        console.log(this.state);
        const formData = new FormData();
        Object.entries(this.state).forEach(([key, value]) => formData.append(key, value));
        console.log(formData);
        fetch('/api/registration', {
            body: formData,
            method: 'POST'
        })
    }

    render() {
        return (
            <Layout>
                <article className='registration-page'>
                    <form className='registration-pane'>
                        <div className='registration-pane__label'>Регистрация</div>
                        <input 
                            id='login' 
                            name='login' 
                            type='text' 
                            className='registration-pane__input' 
                            placeholder='Логин' 
                            onChange={(event) => this.setState({login: event.target.value})}></input>
                        <input 
                            id='password' 
                            name='password' 
                            type='text' 
                            className='registration-pane__input' 
                            placeholder='Пароль'
                            onChange={(event) => this.setState({ password: event.target.value })}></input>
                        <div className='fileform'>
                            <div className='fileform__label' id='fileformlabel'></div>
                            <div className='fileform__selectbutton'>Обзор</div>
                            <input className='fileform__input' type='file' name='avatar-file' id='avatar-file' accept='image/jpeg,image/png' onChange={(event) => {
                                this.setFileName(event.target.value);
                                console.log(event.target.files);
                                this.setState({ avatar: event.target.files ? event.target.files[0] : null})
                            }}/>
                        </div>
                        <button className='registration-pane__done-button' onClick={(event) => {
                            event.preventDefault();
                            this.registerUser();
                        }}>
                            Зарегистрироваться и войти
                        </button>
                    </form>
                </article>
            </Layout>
        )
    }
}

export default RegistrationPage;
