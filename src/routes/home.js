import { Button, TextField } from "@mui/material";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function HomeRoute() {
    
  const navigate=useNavigate();

    const managerIdInputRef = useRef(null);
    const submitRef = useRef(null);

    return (
        <section style={{
            display: "flex",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <section style={{
                width: 0,
                flexGrow: 1,
                maxWidth: 500,
            }}>
                <TextField variant="outlined" inputRef={managerIdInputRef} style={{
                    width: "100%",
                }} placeholder="manager id" helperText=""
                    autoComplete="none"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            submitRef.current.click(e);
                        }
                    }}
                    sx={{ color: "red" }}
                />
            </section>
            <section style={{
                width:12,
            }}></section>
            <Button ref={submitRef} variant="contained" style={{
                textTransform:"none",
            }} onClick={function(){
                const managerId=managerIdInputRef.current.value;
                if(!managerId){
                    return;
                }
                navigate(`/${managerId}`);
            }}>
                Submit
            </Button>
        </section>
    );
}