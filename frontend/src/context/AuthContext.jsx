
import React,{createContext,useContext,useState} from 'react'
import api from '../lib/axios'
const C=createContext(null)
export const useAuth=()=>useContext(C)
export function AuthProvider({children}){
  const [user,setUser]=useState(()=>{ const r=localStorage.getItem('user'); return r?JSON.parse(r):null })
  const login=async(email,password)=>{ const {data}=await api.post('/auth/login',{email,password}); localStorage.setItem('token',data.token); localStorage.setItem('user',JSON.stringify(data.user)); setUser(data.user) }
  const register=async(u,e,p)=>{ await api.post('/auth/register',{username:u,email:e,password:p}); await login(e,p) }
  const logout=()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null) }
  return <C.Provider value={{user,setUser,login,register,logout}}>{children}</C.Provider>
}
