import { JwtPayload } from 'jsonwebtoken'

export interface ISecurityPayload extends JwtPayload {
  _id: string
}