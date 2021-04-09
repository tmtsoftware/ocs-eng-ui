import React from 'react'
type IconProps = {
  className?: string
  fill?: string
}
export const Settings = ({ className, fill }: IconProps): JSX.Element => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      className={className}
      fill={fill ? fill : 'currentColor'}>
      <path d='M19.214 12.5412L17.752 11.2912C17.8212 10.8671 17.8569 10.434 17.8569 10.001C17.8569 9.56796 17.8212 9.13492 17.752 8.71082L19.214 7.46082C19.3243 7.36641 19.4033 7.24067 19.4403 7.10032C19.4774 6.95997 19.4709 6.81166 19.4216 6.6751L19.4015 6.61707C18.999 5.49212 18.3963 4.44929 17.6225 3.53894L17.5823 3.49207C17.4885 3.38169 17.3634 3.30235 17.2235 3.26449C17.0836 3.22664 16.9356 3.23205 16.7989 3.28001L14.9841 3.9251C14.3145 3.37599 13.5667 2.94296 12.7587 2.63939L12.4082 0.742065C12.3818 0.599303 12.3125 0.467964 12.2097 0.365498C12.1068 0.263032 11.9752 0.19429 11.8323 0.168405L11.7721 0.157244C10.6091 -0.0525774 9.38592 -0.0525774 8.22297 0.157244L8.16271 0.168405C8.01984 0.19429 7.88824 0.263032 7.78537 0.365498C7.68251 0.467964 7.61325 0.599303 7.58681 0.742065L7.23414 2.64832C6.43255 2.95195 5.68607 3.38476 5.02431 3.92957L3.19619 3.28001C3.05951 3.23167 2.91135 3.22606 2.7714 3.26394C2.63146 3.30182 2.50635 3.38138 2.41271 3.49207L2.37253 3.53894C1.59964 4.44993 0.997028 5.4926 0.59351 6.61707L0.573421 6.6751C0.472975 6.95412 0.555564 7.26662 0.78101 7.46082L2.26092 8.72421C2.19172 9.14385 2.15824 9.57242 2.15824 9.99876C2.15824 10.4273 2.19172 10.8559 2.26092 11.2733L0.78101 12.5367C0.670733 12.6311 0.591806 12.7569 0.554725 12.8972C0.517643 13.0376 0.524164 13.1859 0.573421 13.3224L0.59351 13.3805C0.997528 14.5055 1.59574 15.5434 2.37253 16.4586L2.41271 16.5055C2.50658 16.6158 2.63169 16.6952 2.77155 16.733C2.91141 16.7709 3.05946 16.7655 3.19619 16.7175L5.02431 16.068C5.68949 16.6148 6.4328 17.0479 7.23414 17.3492L7.58681 19.2555C7.61325 19.3982 7.68251 19.5296 7.78537 19.632C7.88824 19.7345 8.01984 19.8032 8.16271 19.8291L8.22297 19.8403C9.39661 20.0512 10.5984 20.0512 11.7721 19.8403L11.8323 19.8291C11.9752 19.8032 12.1068 19.7345 12.2097 19.632C12.3125 19.5296 12.3818 19.3982 12.4082 19.2555L12.7587 17.3581C13.5664 17.0554 14.3184 16.6209 14.9841 16.0724L16.7989 16.7175C16.9356 16.7659 17.0837 16.7715 17.2237 16.7336C17.3636 16.6957 17.4887 16.6161 17.5823 16.5055L17.6225 16.4586C18.3993 15.5412 18.9975 14.5055 19.4015 13.3805L19.4216 13.3224C19.5221 13.0479 19.4395 12.7354 19.214 12.5412ZM16.1672 8.97421C16.223 9.31126 16.252 9.65724 16.252 10.0032C16.252 10.3492 16.223 10.6952 16.1672 11.0322L16.0198 11.9273L17.6873 13.3537C17.4345 13.936 17.1154 14.4873 16.7364 14.9965L14.6649 14.2622L13.964 14.838C13.4306 15.2755 12.8368 15.6193 12.194 15.8604L11.3435 16.1796L10.944 18.3447C10.3135 18.4162 9.67706 18.4162 9.04663 18.3447L8.64708 16.1751L7.80333 15.8514C7.16717 15.6104 6.57565 15.2666 6.04664 14.8314L5.34574 14.2532L3.26092 14.9943C2.88146 14.4831 2.56449 13.9318 2.31003 13.3514L3.9953 11.9117L3.85021 11.0189C3.79664 10.6863 3.76762 10.3425 3.76762 10.0032C3.76762 9.66171 3.7944 9.32019 3.85021 8.9876L3.9953 8.09474L2.31003 6.65501C2.56226 6.07242 2.88146 5.52332 3.26092 5.01216L5.34574 5.75323L6.04664 5.1751C6.57565 4.73983 7.16717 4.39608 7.80333 4.15501L8.64931 3.83582L9.04887 1.66617C9.6761 1.59474 10.3167 1.59474 10.9462 1.66617L11.3457 3.83135L12.1962 4.15055C12.8368 4.39162 13.4328 4.73537 13.9663 5.17287L14.6672 5.74876L16.7386 5.01439C17.1181 5.52555 17.435 6.07689 17.6895 6.65724L16.0221 8.08358L16.1672 8.97421ZM9.99976 5.85144C7.83012 5.85144 6.07119 7.61037 6.07119 9.78001C6.07119 11.9497 7.83012 13.7086 9.99976 13.7086C12.1694 13.7086 13.9283 11.9497 13.9283 9.78001C13.9283 7.61037 12.1694 5.85144 9.99976 5.85144ZM11.7676 11.5479C11.5357 11.7804 11.2602 11.9648 10.9568 12.0905C10.6534 12.2161 10.3281 12.2805 9.99976 12.28C9.33235 12.28 8.70512 12.0189 8.2319 11.5479C7.99937 11.316 7.81497 11.0404 7.68932 10.737C7.56367 10.4336 7.49925 10.1084 7.49976 9.78001C7.49976 9.1126 7.76092 8.48537 8.2319 8.01216C8.70512 7.53894 9.33235 7.28001 9.99976 7.28001C10.6672 7.28001 11.2944 7.53894 11.7676 8.01216C12.0002 8.24403 12.1846 8.51959 12.3102 8.82298C12.4359 9.12638 12.5003 9.45163 12.4998 9.78001C12.4998 10.4474 12.2386 11.0747 11.7676 11.5479Z' />
    </svg>
  )
}
