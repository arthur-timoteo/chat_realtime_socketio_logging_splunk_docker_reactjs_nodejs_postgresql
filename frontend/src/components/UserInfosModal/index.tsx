import { useEffect, useState } from 'react';
import './style.css';
import { FaCircleUser, FaCopy } from "react-icons/fa6";
import { api } from '../../services/axios';
import { format } from 'date-fns';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ShortUniqueId from 'short-uuid';
import { Log } from '../../services/logger';

interface UserInfosModalProps {
    pkMember: string
}

interface AccountInfo {
    pk: string,
    first_name: string,
    email: string,
    created_at: string
}

export function UserInfosModal({ pkMember }: UserInfosModalProps) {
    const [account, setAccount] = useState<AccountInfo>();
    const shortPkMember = ShortUniqueId().fromUUID(pkMember);

    useEffect(() => {
        getAccountInfos();
    },[]);

    async function getAccountInfos(){
        try
        {
            await api.get(
                '/account',
                {
                    headers: {
                        Authorization: pkMember
                    }
                }
            ).then(response => setAccount(response.data.data));
        }
        catch(error) {
            await Log('Error when trying to pick up member account information', 'ERROR', 'UIM-I-GAI-0', 
                `data: {pkMember: ${pkMember}}, error: ${error as string}`);
        }
    }

    return (
        <div className="user-infos-modal-area">
            <FaCircleUser />
            <h2>{account?.first_name}</h2>

            <div className="line-info">
                <label>User Code:</label>
                <span>
                    {shortPkMember}
                    <CopyToClipboard text={shortPkMember}>
                        <button className='clipboard-copy'><FaCopy/></button>
                    </CopyToClipboard>
                </span>
            </div>
            
            <div className="line-info">
                <label>Email:</label>
                <span>{account?.email}</span>
            </div>
            
            <div className="line-info">
                <label>Account created at:</label>
                <span>{ account == undefined ? '' : format(account!.created_at, 'MM/dd/yyyy') }</span>
            </div>
        </div>
    )
}