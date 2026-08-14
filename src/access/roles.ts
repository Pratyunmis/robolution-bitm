import type { Access } from 'payload'
import type { User } from '../payload-types'

/**
 * Returns true if the user is logged in.
 */
export const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

/**
 * Returns true only if the user has the 'admin' role.
 */
export const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'admin'
}

/**
 * Returns true if the user is a 'member' or 'admin'.
 */
export const isMemberOrAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'admin' || user?.role === 'member'
}

/**
 * Returns true if the user is authenticated (all logged in users have at least 'intern' role).
 */
export const isInternOrAbove: Access = ({ req: { user } }) => {
  return Boolean(user)
}

/**
 * Returns true if the user is an admin, OR if the user is attempting to access their own record.
 * Typically used for the Users collection or records that have a direct relationship to a user.
 */
export const isSelfOrAdmin: Access = ({ req: { user }, id }) => {
  if (!user) return false
  if (user.role === 'admin') return true
  
  // If the record has an ID, check if it matches the current user's ID
  if (id) {
    return user.id === id
  }
  
  // If no ID is provided (e.g. creating a record, or reading a list), 
  // we rely on other access controls or queries to filter data.
  // Returning false here for lists means non-admins can't read the whole collection by default 
  // if this is used as a read access function.
  return false
}
