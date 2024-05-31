import Users from '../models/UserModel.js'
import bcrypt from 'bcrypt'
import path from 'path'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const SECRET_KEY =
  process.env.ACCESS_TOKEN_SECRET || 'qwerttyuio12345asdfghjkl67890zxcvbnm'

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll()
    res.json(users)
  } catch (error) {
    console.log(error)
  }
}

export const Register = async (req, res) => {
  const { username, email, password } = req.body

  const user = await Users.findOne({ where: { username } })
  if (user) {
    return res.status(404).json({ msg: 'Username sudah ada! ganti username!' })
  }

  const salt = await bcrypt.genSalt()
  const hashPassword = await bcrypt.hash(password, salt)
  try {
    await Users.create({
      username: username,
      email: email,

      password: hashPassword,
    })
    res.json({ msg: 'Register Berhasil' })
  } catch (error) {
    console.log(error)
  }
}

export const Login = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        email: req.body.email,
      },
    })

    if (!user) {
      return res.status(404).json({ msg: 'User not found' })
    }

    const match = await bcrypt.compare(req.body.password, user.password)
    if (!match) {
      return res.status(400).json({ msg: 'Wrong Password' })
    }

    const { id, name, username, email, phone, role, image } = user

    const accessToken = jwt.sign(
      {
        userId: id,
        name,
        username,
        email,
        phone,
        role,
        image,
      },
      SECRET_KEY,
      {
        expiresIn: '1d',
      },
    )

    await Users.update(
      { refresh_token: accessToken },
      {
        where: {
          id,
        },
      },
    )

    res.json({ accessToken, role })
  } catch (error) {
    console.log(error.message)
    return res.status(401).json({
      msg: error.message,
    })
  }
}

export const Me = async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ msg: 'Unauthorized' }) // Unauthorized if no token provided

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || 'qwerttyuio12345asdfghjkl67890zxcvbnm',
    )

    const user = await Users.findOne({
      where: {
        id: decoded.userId,
        refresh_token: token, // Verify token existence in the database
      },
    })

    if (!user) {
      return res.status(401).json({ msg: 'Unauthorized' }) // Unauthorized if token not found in database
    }

    res.json(user) // Return the user details
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Internal Server Error')
  }
}

export const Logout = async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(204).json({ msg: 'No token provided' }) // No content if no token

    const user = await Users.findOne({
      where: {
        refresh_token: token,
      },
    })

    if (!user) {
      return res
        .status(204)
        .json({ msg: 'User not found or already logged out' }) // No content if user not found
    }

    await Users.update(
      { refresh_token: null },
      {
        where: {
          id: user.id,
        },
      },
    )

    return res.status(200).json({ msg: 'Logout successful' })
  } catch (error) {
    console.log('Logout error:', error.message)
    return res.status(500).json({ msg: 'Internal server error' })
  }
}

export const updateUsers = async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ msg: 'Unauthorized' }) // Unauthorized if no token provided

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || 'qwerttyuio12345asdfghjkl67890zxcvbnm',
    )

    const user = await Users.findOne({
      where: {
        id: decoded.userId,
        refresh_token: token, // Verify token existence in the database
      },
    })

    if (!user) {
      return res.status(401).json({ msg: 'Unauthorized' }) // Unauthorized if token not found in database
    }

    let fileName = user.image || 'default.png'
    if (req.files && req.files.image) {
      // Periksa req.files.image
      console.log('File upload detected')

      const file = req.files.image // Akses file sebagai req.files.image
      const fileSize = file.size
      const ext = path.extname(file.name)
      fileName = file.md5 + ext

      const allowedType = ['.png', '.jpg', '.jpeg']
      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: 'Invalid image type' })
      }
      if (fileSize > 5000000) {
        return res.status(422).json({ msg: 'Max image size is 5MB' })
      }

      file.mv(`./public/images/${fileName}`, (err) => {
        if (err) {
          console.log('Error moving file:', err.message)
          return res.status(500).json({ msg: err.message })
        }
        console.log('File uploaded successfully')
      })
    } else {
      console.log('No file upload detected')
    }

    const { name, email, phone, role } = req.body

    await Users.update(
      {
        name,
        username: user.username,
        email,
        phone,
        role,
        image: fileName,
      },
      {
        where: {
          id: user.id,
        },
      },
    )

    res.status(200).json({ msg: 'User updated successfully' })
  } catch (error) {
    console.log('Error updating user:', error.message)
    res.status(500).json({ msg: error.message, error: 'Internal server error' })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ msg: 'Unauthorized' }) // Unauthorized if no token provided

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await Users.findOne({
      where: {
        id: decoded.userId,
        refresh_token: token, // Verify token existence in the database
      },
    })

    if (!user) {
      return res.status(401).json({ msg: 'Unauthorized' }) // Unauthorized if token not found in database
    }

    // Optionally remove the user's image
    if (user.image && user.image !== 'default.png') {
      const filePath = `./public/images/${user.image}`
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log('Failed to remove image:', err)
        }
      })
    }

    await Users.destroy({
      where: {
        id: user.id,
      },
    })

    res.status(200).json({ msg: 'User deleted successfully' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ msg: error.message })
  }
}

export const nePassword = async (req, res) => {
  const { email, password } = req.body

  const user = await Users.findOne({ where: { email } })
  if (!user) {
    return res.status(404).json({ msg: 'Email tidak ditemukan' })
  }

  const salt = await bcrypt.genSalt()
  const hashPassword = await bcrypt.hash(password, salt)
  try {
    await Users.update({ password: hashPassword }, { where: { email } })
    res.json({ msg: 'Update Password Berhasil' })
  } catch (error) {
    console.log(error)
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await Users.findOne({ where: { email } })
    if (!user) {
      return res.status(404).json({ msg: 'Email tidak ditemukan' })
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: 'kiravelnote@gmail.com',
      to: email,
      subject: 'Reset Password',
      text:
        'Klik link ini untuk reset password: http://localhost:5173/reset-password',
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error:', error)
        res.status(500).json({ msg: 'Gagal mengirim email reset password' })
      } else {
        console.log('Email reset password terkirim:', info.response)
        res.status(200).json({ msg: 'Email reset password berhasil dikirim' })
      }
    })
  } catch (error) {
    console.error('Error:', error)
    res
      .status(500)
      .json({ msg: 'Terjadi kesalahan dalam proses reset password' })
  }
}
