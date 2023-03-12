import { useContext } from "react"
import { Text } from "react-native"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useNavigation } from "@react-navigation/native"
import { Context } from "../../Context"
import { Input } from "@rneui/themed"
import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import * as S from "./SignIn.styled"
import { SIGNUP_ROUTE } from "../../routesNames"
import { View } from "react-native-ui-lib"
import { signInFileds } from "../../utils/textFileds"
import { colors } from "../../styled/colors"

const SignIn = () => {
  const { auth } = useContext(Context)
  const navigation = useNavigation()

  const {
    register,
    setValue,
    handleSubmit,
    setError,
    control,
    reset,
    formState: { errors }
  } = useForm()

  const authUser = data => {
    signInWithEmailAndPassword(auth, data.email, data.password).catch(err => {
      let jsonError = JSON.stringify(err)
      const code = JSON.parse(jsonError).code
      console.log(code)
      if (code.includes("password")) {
        setError("password", {
          message: "Incorrect password"
        })
      }

      if (code.includes("requests")) {
        setError("email", {
          message: "Too many login attempts"
        })
      }

      if (code.includes("found")) {
        setError("email", {
          message: "Not found this user"
        })
      }
    })
  }

  return (
    <S.Container>
      <View>
        <S.Title>Sign In</S.Title>
        <S.SubTitle>Sign in your account</S.SubTitle>
        {signInFileds.map(({ name, placeholder, secureTextEntry, options, icon }) => {
          return (
            <S.TextFiled key={name}>
              <Controller
                control={control}
                name={name}
                rules={options}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <Input
                    placeholder={placeholder}
                    value={value}
                    onBlur={onBlur}
                    secureTextEntry={secureTextEntry}
                    style={error && { color: "red" }}
                    onChangeText={value => onChange(value)}
                    errorMessage={error && error.message}
                    leftIcon={() => icon(error)}
                  />
                )}
              />
            </S.TextFiled>
          )
        })}
        <S.PrimaryButton
          color={colors.primary}
          title="Sign in"
          onPress={handleSubmit(authUser)}
        />
      </View>
      <Text style={{ alignSelf: "center" }}>
        Don't have account?
        <S.NavLink
          onPress={() => {
            navigation.navigate(SIGNUP_ROUTE)
          }}
        >
          {" "}
          Create account
        </S.NavLink>
      </Text>
    </S.Container>
  )
}

export { SignIn }
