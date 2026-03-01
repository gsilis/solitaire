import { CardAnchor } from "./card-anchor";
import { FlippableActor } from "./flippable-actor";

export class StackManager {
  private anchors: CardAnchor[] = []
  private cards: FlippableActor[] = []

  private startingStack: CardAnchor | undefined
  private startingCard: FlippableActor | undefined
  private endingStack: CardAnchor | undefined
  private endingCard: FlippableActor | undefined
  private temporaryStack: CardAnchor

  constructor(temporaryStack: CardAnchor) {
    this.temporaryStack = temporaryStack
  }

  addStacks(...stacks: CardAnchor[]) {
    stacks.forEach((stack) => {
      stack.on('pointerdown', () => this.onStackDown(stack))
      stack.on('pointerup', () => this.onStackUp(stack))
    })
    this.anchors.push(...stacks)
  }

  addCards(...cards: FlippableActor[]) {
    cards.forEach((card) => {
      card.on('pointerdown', () => this.onCardDown(card))
      card.on('pointerup', () => this.onCardUp(card))
    })
    this.cards.push(...cards)
  }

  cleanup() {
    this.anchors.forEach(anchor => {
      anchor.off('pointerdown')
      anchor.off('pointerup')
    })

    this.cards.forEach((card) => {
      card.off('pointerdown')
      card.off('pointerup')
    })

    this.anchors = []
    this.cards = []
  }

  private onStackDown = (stack: CardAnchor) => {
    console.log(`STACK ${stack.name}`, stack.z)

    if (this.startingStack) {
      console.log('STACK DOWN - Have starting stack, exiting')
      return
    }

    this.startingStack = stack
  }

  private onStackUp = (stack: CardAnchor) => {
    console.log(`STACK ${stack.name}`, stack.z)
    if (this.endingStack) {
      return
    }

    this.endingStack = stack
  }

  private onCardDown = (card: FlippableActor) => {
    //@ts-ignore
    console.log('CARD DOWN', card.source?._card?.toString(), card.z, card.name, this.startingStack?.name, this.startingCard?.source?._card?.toString())

    if (this.startingCard) {
      return
    }

    this.startingCard = card
    const sequence = this.startingStack?.detach(card) || []

    if (!sequence || sequence.length === 0) {
      return
    }

    this.temporaryStack.attach(...sequence)
  }

  private onCardUp = (card: FlippableActor) => {
    //@ts-ignore
    console.log('CARD UP', card.source?._card?.toString(), card.z, card.name, this.startingStack?.name, this.startingCard?.source?._card?.toString())

    if (this.endingCard) {
      console.log('CARD UP - Have ending card, exiting')
      return
    }

    this.endingCard = card
    const cards = this.temporaryStack.detachAll()
    
    if (this.endingStack) {
      this.endingStack.attach(...cards)
    } else if (this.startingStack) {
      this.startingStack.attach(...cards)
    }

    this.endingStack = undefined
    this.endingStack = undefined
    this.startingCard = undefined
    this.endingCard = undefined
  }
}