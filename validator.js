//Start check input and notify modal 
function validator(options){
    function getParent(element,selector){
        while(element.parentElement)
        {
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element=element.parentElement;
        }
    }

    var selectorRules={};

    // hàm thực hiện validate 
    function validate(inputElement,rule){
        //var erorElement = getParent()
        var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector)
        var errorMessage;
        //lấy các rule của selector
        var rules=selectorRules[rule.selector]
        //lặp qua từng rule và kiểm tra nếu có lỗi thì dừng việc kiểm
        for (var i=0; i<rules.length; ++i){
            errorMessage=rules[i](inputElement.value);
            if(errorMessage) break;
        }
            if(errorMessage)
            {
                errorElement.innerHTML = errorMessage;
                inputElement.parentElement.classList.add('invalid')
            }
            else{
                errorElement.innerHTML = " ";
                inputElement.parentElement.classList.remove('invalid')
            }
            return !errorMessage;
            
    }
// lấy element của form  
    var formElement = document.querySelector(options.form)
    if(formElement){

        // xử lí submit form
        formElement.onsubmit = function(e)
        {
            var isFormValid=true;
            e.preventDefault();
            //lặp qua từng rules và
            options.rules.forEach(function(rule){
                var inputElement=formElement.querySelector(rule.selector)
                //thực hiện lặ qua từng rule và validate
                var isValid=  validate(inputElement,rule)
                if(!isValid){
                    isFormValid =false;
                }
            });
            if (isFormValid){ 
                //Trường Hợp submit vơi js
                if(typeof options.onsubmit==='function'){
                    var enableInputs =formElement.querySelectorAll('[name]');
                    var formValues=Array.from(enableInputs).reduce(function(values,input){
                        values[input.name]=input.value
                        return values
                    },{});
                    options.onsubmit(formValues);
                }
                // trường hợp submit với hành vi mặc định
                else{
                    formElement.submit();
                }
            }
        }
        //lặp qua mỗi rule và xử lí
        options.rules.forEach(function(rule){

            //lưu lại các rules cho  input
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }
            else{
                selectorRules[rule.selector]=[rule.test]
            }

            var inputElement=formElement.querySelector(rule.selector)
            if(inputElement)
            {
                //xử lí trường hợp khi blur ra khỏi input
                inputElement.onblur = function(){
                    validate(inputElement,rule)
                }
                //xử lí trường hớp khi người dùng nhập vào input
                inputElement.oninput = function(){
                    var errorElement = inputElement.parentElement.querySelector('.form-massage')
                    errorElement.innerText = "";
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        
        });
        
    }   
}

validator.isRequired = function(selector,message)
{
    return {
        selector:selector,
        test:function(value){
            return value ? undefined : message || 'Vui lòng nhập trường này !';
        }
    }
}
validator.isEmail = function(selector,message){
    return {
        selector:selector,
        test: function(value) {
            let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regexEmail.test(value) ? undefined : message ||'Vui lòng nhập đúng email !'
        }
    }
}
validator.isPassword = function(selector,min,message)
{
    return {
        selector:selector,
        test:function(value){
            return value.length>=min ? undefined : message ||`Mật khẩu phải tối thiểu ${min} kí tự`;
        }
    }
}
validator.isConfirmed=function(selector,getConfirmedValue,message){
    return{
        selector:selector,
        test:function(value){
            return value===getConfirmedValue() ? undefined  : message || 'Giá trị nhập vào không chính xác'
        }
    }
}



//End check input and notify modal 