import { useRouter } from 'next/router'
import Link, { LinkProps } from 'next/link'
import { ReactElement, cloneElement } from 'react'

interface ActiveLinkProps extends LinkProps {
  children: ReactElement
  activeLinkClassName: string
}

export function ActiveLink({
  children,
  activeLinkClassName,
  ...rest
}: ActiveLinkProps) {
  const { asPath } = useRouter()

  const className = asPath === rest.href ? activeLinkClassName : ''

  return <Link {...rest}>{cloneElement(children, { className })}</Link>
}
