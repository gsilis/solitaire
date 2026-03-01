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
    if (this.startingStack) {
      return
    }

    console.log(`STACK ${stack.name}`)
    this.startingStack = stack
  }

  private onStackUp = (stack: CardAnchor) => {
    if (this.endingStack) {
      return
    }

    this.endingStack = stack
  }

  private onCardDown = (card: FlippableActor) => {
    if (!this.startingStack || this.startingCard) {
      return
    }

    console.log(`CARD ${card.toString()}`)
    this.startingCard = card
    const sequence = this.startingStack.detach(card)

    if (!sequence || sequence.length === 0) {
      return
    }

    this.temporaryStack.attach(...sequence)
  }

  private onCardUp = (card: FlippableActor) => {
    if (this.endingCard) {
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