import {useForm} from 'react-hook-form'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { useState } from 'react'


function ForgotPw(){
	const {handleSubmit,register} = useForm()
	const nav = useNavigate()
	const [step,setStep] = useState(1)
	
	async function resetPassword( data ){
		try {
			const res = await axios.post('http://127.0.0.1:8000/forgotpw/',data)
			if( res.status == 200 ){
				console.log('data saved',res)
				nav('/login/')
			}
		} catch(e) {
			console.log(e);
			alert('Something went wrong..!')
		}
	}


  	async function sendMail( ){
		let email = document.querySelector("#email-Inp").value
		if( email ){
			try {
				const res = await axios.post('http://127.0.0.1:8000/otp2/', { email: email } )
				if( res.status == 200 ){
					alert('Otp Send..!')
					console.log('otp send',res)
					setStep(2)
				}
			} catch(e) {
				console.log(e);
				alert('Something went wrong..!')
			}
		}
	}


	return(
		<div className="p-3 mt-2">
		<div className='mx-auto p-4 ps-5 pe-5 rounded' style={{width:'60%',background:'rgb(170,240,170)'}}>	
			<h4 className="text-center mb-3">Forgot Password Form</h4>
			<form onSubmit={handleSubmit(resetPassword)} id="signupForm" className="row g-3" encType="multipart/form-data">
				
				{
					(step===1) ?

					<div className="col-md-6">
						<label className="form-label">Email : <span className="text-danger">*</span></label>
						<input type="email" {...register('email')} id="email-Inp" placeholder="email here.." className="form-control mb-2" required/>
						<button type='button' onClick={sendMail} className='btn btn-sm btn-outline-primary' >Send Mail</button>
					</div>

					:

					<>

					<div className="col-md-6">
						<label className="form-label">Email : <span className="text-danger">*</span></label>
						<input type="email" {...register('email')} id="email-Inp" placeholder="email here.." className="form-control mb-2" required/>
					</div>
					
					<div className="col-md-6">
						<label className="form-label">Otp : <span className="text-danger">*</span></label>
						<input type="text" {...register('otp')} placeholder="otp here.." className="form-control mb-2" required/>
					</div>

					<div className="col-md-6">
						<label className="form-label">New Password : <span className="text-danger">*</span></label>
						<input type="password" {...register('new_password')} placeholder="password here.." className="form-control mb-2" required/>
					</div>
					
					

					<div className="col-md-12">
						<button className="btn btn-outline-success col-4 d-block mt-3 mx-auto">Reset Password</button>	
					</div>
										
					</>

				}

			</form>

		</div>
		</div>
	)
}

export default ForgotPw
