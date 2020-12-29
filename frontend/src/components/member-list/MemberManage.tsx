import axios from "axios";
import React, { FunctionComponent, useEffect, useState } from "react";
import { ApiUrl } from "../../constants/constants";
import { User } from "../../models/user.model";
import { UserTable } from "../table/MemberTable";
import { Title } from "../title/Title";

export const MemberManage: FunctionComponent = (prop) => {
    const [memberlist, setMemberlist] = useState<User[]>([]);
    useEffect(()=>{
        const getMemberlist = () => {
			try {
				axios(`${ApiUrl}/api/getMemberlist`).then((res) => {
					setMemberlist(res.data);
				});
			} catch (error){
				console.log(error);
			}
		}
        getMemberlist();

    },[])
    return (
        <React.Fragment>
            <Title>Member Manage</Title>
            <UserTable data={memberlist}></UserTable>
        </React.Fragment>
    );
}