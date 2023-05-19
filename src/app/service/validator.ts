import { FormGroup } from "@angular/forms"

export function confirmField(field:string, matchField:string){
return (formGroup:FormGroup) => {

const control=formGroup.controls[field]
const matchingControl=formGroup.controls[matchField]
if(matchingControl.errors&&!matchingControl.errors['confirmed'])
    return
if(matchingControl.value!==control.value){
    return matchingControl.setErrors({confirmed:true})
}
else matchingControl.setErrors(null)
}

}